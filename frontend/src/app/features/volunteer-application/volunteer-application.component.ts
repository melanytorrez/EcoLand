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
      availableWeekends: [true, Validators.required],
      hasEnvironmentalExperience: [false, Validators.required],
      experienceDetails: [''],
      motivation: ['', [Validators.required, Validators.minLength(20)]],
      availabilityHours: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.form = this.buildForm();

    const currentUser = this.authService.getUser();
    this.userName = currentUser?.nombre || currentUser?.fullName || currentUser?.name || '';

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('campaignId');
      this.campaignId = idParam ? Number(idParam) : null;

      if (!this.campaignId) {
        this.errorMessage = 'No se encontró la campaña seleccionada.';
        this.isLoading = false;
        return;
      }

      this.campaignService.getCampaignById(this.campaignId).subscribe({
        next: (campaign) => {
          this.campaign = campaign;
          if (this.userName) {
            this.form.patchValue({ fullName: this.userName });
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
    });
  }

  submit(): void {
    if (!this.campaignId || this.form.invalid) {
      this.form.markAllAsTouched();
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
}