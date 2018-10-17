import { Component, OnInit, Input } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { CohortService } from '../../services/cohort.service';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cohort-drive',
  templateUrl: './cohort-drive.component.html',
  styleUrls: ['./cohort-drive.component.scss']
})
export class CohortDriveComponent implements OnInit {
  @Input() cohort: any;
  feedbackEnabled = false;
  error = null;
  processing = false;
  uploader: FileUploader;
  loading = true;
  fileFeedback = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private cohortService : CohortService
  ) {}

  ngOnInit () {
    this.cohortService.cohortChange$.subscribe((cohort) => {
      this.cohort = cohort;
    })

    this.uploader = new FileUploader({
      url: environment.apiUrl + `/cohort/${this.cohort._id}/drive`
    });
  }

  submitForm(form) {
    this.error = '';
    this.feedbackEnabled = true;
    const filesSelected = this.uploader.getNotUploadedItems();
    if (!filesSelected.length) {
      this.fileFeedback = true;
    }
    if (form.valid && filesSelected.length) {
      this.uploader.onBuildItemForm = (item, form2) => {
      };
      // this.cohortService.addImage(this.cohort);
      this.uploader.onSuccessItem = (item, response) => {
        this.router.navigate([`/cohort/${this.cohort._id}`]);
      };

      this.uploader.onErrorItem = (item, response, status, headers) => {
        this.error = JSON.parse(response).code;
        this.processing = false;
        this.feedbackEnabled = false;
      };
      this.uploader.uploadAll();
      this.processing = true;

    }
  }
  //   if (form.valid) {
  //     this.uploader.onBuildItemForm = (item, form2) => {
  //       form2.append('name', this.name);
  //     };
  //   }
  //   this.uploader.uploadAll();
  // }

  // this.uploader.onSuccessItem = (item, response) => {
  //   // this.cohortService.getCo()
  //   // .then((results) => {
  //   //   this.students = results;
  //   // });
  // };

  // this.uploader.onErrorItem = (item, response, status, headers) => {
  //   this.feedback = JSON.parse(response).message;
  // };

}
