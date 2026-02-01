import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Exam, User } from '@batstateu/data-models';
import { ExamsService, SectionService } from '@batstateu/shared';
import { NzModalService } from 'ng-zorro-antd/modal';
import { format } from 'date-fns';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromAuth from '@batstateu/auth';
import { toHTML } from 'ngx-editor';
import { ExamFormViewComponent } from '../../components/exam-form-view/exam-form-view.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';
@Component({
  imports: [ExamFormViewComponent, CommonModule],
  selector: 'batstateu-exam-form',
  templateUrl: './exam-form.component.html',
  styleUrls: ['./exam-form.component.less'],
})
export class ExamFormComponent implements OnInit {
  private sectionService = inject(SectionService);
  public sections = toSignal(this.sectionService.getAll());

  examDetail!: Exam;
  userStore!: User | null;

  constructor(
    private modal: NzModalService,
    private examService: ExamsService,
    private route: ActivatedRoute,
    private location: Location,
    private store: Store<fromAuth.State>,
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getValues();
  }

  onSave(val: any) {
    const date = format(new Date(val.startOn), 'yyyy-MM-dd kk:mm:ss');
    if (this.examDetail && this.examDetail.id > 0) {
      this.examService.edit({ ...val, id: this.examDetail.id, startOn: date }).subscribe(() =>
        this.modal.success({
          nzTitle: 'Success',
          nzContent: 'Exam has been saved',
          nzOkText: 'Ok',
        }),
      );
    } else {
      this.examService
        .add({
          ...val,
          startOn: date,
          isActive: true,
          userDetailId: this.userStore?.userDetailId,
          instructions: toHTML(val.instructions),
        })
        .pipe(take(1))
        .subscribe(() => {
          this.modal.success({
            nzTitle: 'Success',
            nzContent: 'Exam has been saved',
            nzOnOk: () => this.location.back(),
          });
        });
    }
  }
  getValues() {
    const id = Number(this.route.snapshot.paramMap.get('examId'));
    if (id) {
      this.examService.get(id).subscribe((val) => {
        this.examDetail = val;
      });
    }
  }
  getUser() {
    this.store.select(fromAuth.getUser).subscribe((val) => {
      this.userStore = val;
    });
  }
}
