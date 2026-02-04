import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthPayload, Exam } from '@batstateu/data-models';
import { ExamsService, SectionService } from '@batstateu/shared';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromAuth from '@batstateu/auth';
import { ExamFormViewComponent } from '../../components/exam-form-view/exam-form-view.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, Observable, of, switchMap, take, tap } from 'rxjs';
import { toHTML } from 'ngx-editor';
@Component({
  imports: [ExamFormViewComponent, CommonModule],
  selector: 'batstateu-exam-form',
  templateUrl: './exam-form.component.html',
  styleUrls: ['./exam-form.component.less'],
})
export class ExamFormComponent implements OnInit {
  private sectionService = inject(SectionService);
  public sections = toSignal(this.sectionService.getAll());

  examDetail$!: Observable<Exam>;
  userStore!: AuthPayload | null;

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
    const date = new Date(val.startOn);
    this.examDetail$
      .pipe(
        map((x) => x.id),
        switchMap((id) => {
          if (id) {
            return this.examService
              .edit({ ...val, id: id, startOn: date, instructions: val.instructions })
              .pipe(
                tap(() => {
                  this.modal.success({
                    nzTitle: 'Success',
                    nzContent: 'Exam has been saved',
                    nzOkText: 'Ok',
                  });
                }),
              );
          } else {
            return this.examService
              .add({
                ...val,
                startOn: date,
                isActive: true,
                userDetailId: this.userStore?.user.userDetailId,
                instructions: toHTML(val.instructions),
              })
              .pipe(
                tap(() => {
                  this.modal.success({
                    nzTitle: 'Success',
                    nzContent: 'Exam has been saved',
                    nzOnOk: () => this.location.back(),
                  });
                }),
              );
          }
        }),
      )
      .pipe(take(1))
      .subscribe();
  }
  getValues() {
    const id = Number(this.route.snapshot.paramMap.get('examId'));

    this.examDetail$ = id ? this.examService.get(id) : of({} as Exam);
  }
  getUser() {
    this.store.select(fromAuth.getAuthSuccess).subscribe((val) => {
      this.userStore = val;
    });
  }
}
