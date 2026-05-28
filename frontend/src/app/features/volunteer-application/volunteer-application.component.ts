import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { CampaignService } from '../../core/services/campaign.service';
import { VolunteerApplicationService } from '../../core/services/volunteer-application.service';
import { AuthService } from '../../core/services/auth.service';
import { Campaign } from '../../core/models/campaign.model';

@Component({
  selector: 'app-volunteer-application',
  templateUrl: './volunteer-application.component.html',
  styleUrls: ['./volunteer-application.component.css'],
  standalone: false
})
export class VolunteerApplicationComponent implements OnInit {
  campaign: Campaign | null = null;
  campaignId: number | null = null;
  isLoading = true;
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  userName = '';
  submitAttempted = false;
  existingApplicationStatus: string | null = null;
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private volunteerApplicationService: VolunteerApplicationService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  private buildForm(): FormGroup {
    return this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      age: [18, [Validators.required, Validators.min(18)]],
      phone: ['', [Validators.required, Validators.minLength(7)]],
      availableWeekends: [true],
      hasEnvironmentalExperience: [false],
      experienceDetails: [''],
      motivation: ['', [Validators.required, Validators.minLength(20)]],
      availabilityHours: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.form = this.buildForm();

    const currentUser = this.authService.getUser();
    this.userName = currentUser?.nombre || currentUser?.fullName || currentUser?.name || '';
    // If navigation state provided a campaign (and optionally an existing application), use it immediately
    const navState: any = history.state || {};
    if (navState.campaign) {
      this.campaign = navState.campaign as Campaign;
      this.campaignId = this.campaign.id;
      if (navState.existingApplication) {
        const app = navState.existingApplication as any;
        this.existingApplicationStatus = app.status || 'PENDING';
        this.form.patchValue({
          fullName: app.fullName,
          age: app.age,
          phone: app.phone,
          availableWeekends: app.availableWeekends,
          hasEnvironmentalExperience: app.hasEnvironmentalExperience,
          experienceDetails: app.experienceDetails || '',
          motivation: app.motivation,
          availabilityHours: app.availabilityHours
        });
        this.form.disable({ emitEvent: false });
        this.successMessage = this.getExistingApplicationMessage();
        this.isLoading = false;
        this.cdr.detectChanges();
        return;
      }
      // if campaign provided but no existing application, still show campaign immediately
      this.isLoading = false;
    }

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('campaignId');
      this.campaignId = idParam ? Number(idParam) : null;

      if (!this.campaignId) {
        this.errorMessage = 'No se encontró la campaña seleccionada.';
        this.isLoading = false;
        return;
      }

      // Only fetch campaign if we don't already have it from navigation state
      if (!this.campaign) {
        this.campaignService.getCampaignById(this.campaignId).subscribe({
          next: (campaign) => {
            this.campaign = campaign;
            if (this.userName) {
              this.form.patchValue({ fullName: this.userName });
            }

            if (this.authService.isAuthenticated()) {
              this.volunteerApplicationService.getMyApplication(this.campaignId!).subscribe({
                next: (application) => {
                  this.existingApplicationStatus = application.status || 'PENDING';
                  this.form.patchValue({
                    fullName: application.fullName,
                    age: application.age,
                    phone: application.phone,
                    availableWeekends: application.availableWeekends,
                    hasEnvironmentalExperience: application.hasEnvironmentalExperience,
                    experienceDetails: application.experienceDetails || '',
                    motivation: application.motivation,
                    availabilityHours: application.availabilityHours
                  });
                  this.form.disable({ emitEvent: false });
                  this.successMessage = this.getExistingApplicationMessage();
                  this.isLoading = false;
                  this.cdr.detectChanges();
                },
                error: () => {
                  this.isLoading = false;
                  this.cdr.detectChanges();
                }
              });
              return;
            }

            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: () => {
            this.errorMessage = 'No pudimos cargar la campaña.';
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
      } else {
        // campaign already present (from navigation state) - still check existing application if authenticated
        if (this.authService.isAuthenticated() && !this.existingApplicationStatus) {
          this.volunteerApplicationService.getMyApplication(this.campaignId!).subscribe({
            next: (application) => {
              this.existingApplicationStatus = application.status || 'PENDING';
              this.form.patchValue({
                fullName: application.fullName,
                age: application.age,
                phone: application.phone,
                availableWeekends: application.availableWeekends,
                hasEnvironmentalExperience: application.hasEnvironmentalExperience,
                experienceDetails: application.experienceDetails || '',
                motivation: application.motivation,
                availabilityHours: application.availabilityHours
              });
              this.form.disable({ emitEvent: false });
              this.successMessage = this.getExistingApplicationMessage();
              this.cdr.detectChanges();
            },
            error: () => { /* ignore */ }
          });
        }
      }
    });
    });
  }

  submit(): void {
    this.submitAttempted = true;

    if (!this.campaignId) {
      this.errorMessage = 'No se encontró la campaña seleccionada.';
      return;
    }

    if (this.existingApplicationStatus) {
      this.errorMessage = 'Ya tienes una postulación enviada para esta campaña y no puedes enviar otra.';
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = this.getValidationSummary();
      return;
    }

    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    const value = this.form.getRawValue();
    this.volunteerApplicationService.apply({
      campaignId: this.campaignId,
      fullName: value.fullName?.trim() || '',
      age: Number(value.age),
      phone: value.phone?.trim() || '',
      availableWeekends: Boolean(value.availableWeekends),
      hasEnvironmentalExperience: Boolean(value.hasEnvironmentalExperience),
      experienceDetails: value.experienceDetails?.trim() || '',
      motivation: value.motivation?.trim() || '',
      availabilityHours: value.availabilityHours?.trim() || ''
    })
      .pipe(finalize(() => {
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: () => {
          this.successMessage = 'Tu postulación fue enviada correctamente y quedó pendiente de revisión.';
          this.form.markAsPristine();
          this.cdr.detectChanges();
          // Navigate back to campaign detail so CTA updates to 'Solicitud pendiente'
          setTimeout(() => {
            this.router.navigate(['/reforestacion', this.campaignId]);
          }, 400);
        },
        error: (err) => {
          const serverMessage = typeof err?.error?.message === 'string' ? err.error.message : '';
          this.errorMessage = serverMessage || 'No pudimos enviar tu postulación. Revisa los datos e intenta de nuevo.';
          this.cdr.detectChanges();
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/reforestacion', this.campaignId]);
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!control && control.invalid && (control.touched || this.submitAttempted);
  }

  getFieldError(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'Este campo es obligatorio.';
    }

    if (control.errors['minlength']) {
      const requiredLength = control.errors['minlength'].requiredLength;
      return `Debe tener al menos ${requiredLength} caracteres.`;
    }

    if (control.errors['min']) {
      return 'Debes ser mayor de edad para postularte.';
    }

    return 'Revisa este campo.';
  }

  private getValidationSummary(): string {
    const messages: string[] = [];
    const fields = ['fullName', 'age', 'phone', 'motivation', 'availabilityHours'];

    fields.forEach((field) => {
      if (this.isFieldInvalid(field)) {
        const label = field === 'fullName'
          ? 'Nombre completo'
          : field === 'age'
            ? 'Edad'
            : field === 'phone'
              ? 'Teléfono'
              : field === 'motivation'
                ? 'Motivación'
                : 'Horario disponible';

        messages.push(`${label}: ${this.getFieldError(field)}`);
      }
    });

    return messages.length > 0
      ? `Corrige lo siguiente antes de enviar: ${messages.join(' · ')}`
      : 'Completa los campos obligatorios antes de enviar tu postulación.';
  }

  getExistingApplicationMessage(): string {
    if (!this.existingApplicationStatus) {
      return '';
    }

    if (this.existingApplicationStatus === 'PENDING') {
      return 'Ya enviaste tu postulación. Su estado actual es: pendiente de revisión.';
    }

    if (this.existingApplicationStatus === 'ACCEPTED') {
      return 'Ya enviaste tu postulación y fue aceptada.';
    }

    if (this.existingApplicationStatus === 'REJECTED') {
      return 'Ya enviaste tu postulación y fue rechazada.';
    }

    return 'Ya tienes una postulación registrada para esta campaña.';
  }
}