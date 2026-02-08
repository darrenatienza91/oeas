import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthPayload, Exam } from '@batstateu/data-models';
import { ExamsService, SectionService } from '@batstateu/shared';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromAuth from '@batstateu/auth';
import { ExamFormViewComponent } from '../../components/exam-form-view/exam-form-view.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
@Component({
  imports: [ExamFormViewComponent, CommonModule],
  selector: 'batstateu-exam-form',
  templateUrl: './exam-form.component.html',
  styleUrls: ['./exam-form.component.less'],
})
export class ExamFormComponent implements OnInit {
  private sectionService = inject(SectionService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private examService: ExamsService = inject(ExamsService);
  public sections = toSignal(this.sectionService.getAll());
  private id = Number(this.route.snapshot.paramMap.get('examId'));
  public examDetail = this.id
    ? toSignal(this.examService.get(this.id), { initialValue: null })
    : signal(null);
  userStore!: AuthPayload | null;

  constructor(
    private modal: NzModalService,

    private location: Location,
    private store: Store<fromAuth.State>,
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  onSave(val: Exam) {
    const date = new Date(val.startOn);
    if (this.examDetail()) {
      this.examService
        .edit({
          ...val,
          id: this.examDetail()?.id ?? null,
          startOn: date.toISOString(),
          instructions: val.instructions,
        })
        .pipe(
          tap(() => {
            this.modal.success({
              nzTitle: 'Success',
              nzContent: 'Exam has been saved',
              nzOkText: 'Ok',
            });
          }),
        )
        .subscribe();
    } else {
      this.examService
        .add({
          ...val,
          startOn: date?.toISOString(),
          isActive: true,
          instructions: val.instructions,
        })
        .pipe(
          tap(() => {
            this.modal.success({
              nzTitle: 'Success',
              nzContent: 'Exam has been saved',
              nzOnOk: () => this.location.back(),
            });
          }),
        )
        .subscribe();
    }
  }

  getUser() {
    this.store.select(fromAuth.getAuthSuccess).subscribe((val) => {
      this.userStore = val;
    });
  }
}
