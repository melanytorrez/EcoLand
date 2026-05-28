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
  showSubmittedMessage = false;
  existingApplicationMessage: string | null = null;
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

  ngOnInit(): void {
    this.form = this.buildForm();

    const currentUser = this.authService.getUser();
    this.userName = currentUser?.nombre || currentUser?.fullName || currentUser?.name || '';

    const navState: any = history.state || {};
    if (navState.campaign) {
      this.campaign = navState.campaign as Campaign;
      this.campaignId = this.campaign.id;

      if (navState.existingApplication) {
        this.applyExistingApplication(navState.existingApplication);
      }

      this.isLoading = false;
      if (this.campaignId) {
        this.fetchCampaignInBackground(this.campaignId);
      }
    }

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('campaignId');
      const routeCampaignId = idParam ? Number(idParam) : null;

      if (!routeCampaignId) {
        this.errorMessage = 'No se encontró la campaña seleccionada.';
        this.isLoading = false;
        return;
      }

      this.campaignId = routeCampaignId;

      if (!this.campaign) {
        this.loadCampaign(routeCampaignId);
        return;
      }

      if (this.authService.isAuthenticated() && !this.existingApplicationStatus) {
        this.loadExistingApplication(routeCampaignId, true);
      }
    });
  }

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

  private loadCampaign(campaignId: number): void {
    this.campaignService.getCampaignById(campaignId).subscribe({
      next: (campaign) => {
        this.campaign = campaign;
        if (this.userName) {
          this.form.patchValue({ fullName: this.userName });
        }

        if (this.authService.isAuthenticated()) {
          this.loadExistingApplication(campaignId, true);
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
  }

  private fetchCampaignInBackground(campaignId: number): void {
    this.campaignService.getCampaignById(campaignId).subscribe({
      next: (freshCampaign) => {
        this.campaign = freshCampaign;
        this.cdr.detectChanges();
      },
      error: () => {
        // ignore background refresh failures
      }
    });
  }

  private applyExistingApplication(application: any): void {
    this.existingApplicationStatus = application.status || 'PENDING';
    this.existingApplicationMessage = this.computeExistingApplicationMessage();
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
    this.successMessage = this.existingApplicationMessage;
    this.showSubmittedMessage = true;
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  private loadExistingApplication(campaignId: number, background = false): void {
    this.volunteerApplicationService.getMyApplication(campaignId).subscribe({
      next: (application) => {
        this.existingApplicationStatus = application.status || 'PENDING';
        this.existingApplicationMessage = this.computeExistingApplicationMessage();
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
        this.successMessage = this.existingApplicationMessage;
        this.showSubmittedMessage = true;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        if (!background) {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      }
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
          this.existingApplicationStatus = 'PENDING';
          this.existingApplicationMessage = 'Tu postulación fue enviada correctamente y quedó pendiente de revisión.';
          this.form.disable({ emitEvent: false });
          this.successMessage = this.existingApplicationMessage;
          this.showSubmittedMessage = true;
          this.form.markAsPristine();
          this.cdr.detectChanges();
        },
        error: (err: any) => {
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
    return this.existingApplicationMessage || '';
  }

  private computeExistingApplicationMessage(): string {
    if (!this.existingApplicationStatus) return '';
    if (this.existingApplicationStatus === 'PENDING') return 'Ya enviaste tu postulación. Su estado actual es: pendiente de revisión.';
    if (this.existingApplicationStatus === 'ACCEPTED') return 'Ya enviaste tu postulación y fue aceptada.';
    if (this.existingApplicationStatus === 'REJECTED') return 'Ya enviaste tu postulación y fue rechazada.';
    return 'Ya tienes una postulación registrada para esta campaña.';
  }
}
