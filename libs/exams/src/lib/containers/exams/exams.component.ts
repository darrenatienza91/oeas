import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Exam } from '@batstateu/data-models';
import { ExamsService } from '@batstateu/shared';
import { Store } from '@ngrx/store';
import { NzModalService } from 'ng-zorro-antd/modal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as fromAuth from '@batstateu/auth';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, switchMap, take } from 'rxjs';
import { ExamListComponent } from '../../components/exam-list/exam-list.component';
@Component({
  imports: [ExamListComponent],
  selector: 'batstateu-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.less'],
})
export class ExamsComponent implements OnInit {
  criteria = '';
  public examList = signal<Exam[]>([]);
  sectionId!: number | null;
  userDetailId!: number | null;
  private searchSubject$ = new BehaviorSubject<string>('');
  isStudent!: boolean;

  private destroyRef = inject(DestroyRef);

  constructor(
    private examService: ExamsService,
    private store: Store<fromAuth.State>,
    private modal: NzModalService,
  ) {}

  getAll(criteria: string) {
    this.examService
      .getAll(criteria, this.sectionId)
      .pipe(take(1))
      .subscribe((val) => {
        this.examList.set([...val]);
      });
  }
  onChangeStatus(value: { id: number; status: boolean }) {
    if (!!value.status) {
      this.examService
        .deActivate(value.id)
        .pipe(
          switchMap(() => this.examService.getAll(this.criteria, this.sectionId)),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe((val) => {
          this.examList.set([...val]);
        });
      return;
    }

    this.examService
      .activate(value.id)
      .pipe(
        switchMap(() => this.examService.getAll(this.criteria, this.sectionId)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((val) => {
        this.examList.set([...val]);
      });
  }

  onDelete(id: number) {
    this.examService.delete(id).subscribe(() => {
      this.modal.success({
        nzTitle: 'Delete Success',
        nzContent: `Record has been deleted`,
      });
      this.getAll(this.criteria);
    });
  }
  onSearch(criteria: string) {
    this.criteria = criteria;
    this.searchSubject$.next(criteria);
  }
  getUser() {
    this.store.select(fromAuth.getAuthSuccess).subscribe((val) => {
      this.sectionId = val?.user.sectionId ?? null;
      this.userDetailId = val?.user.userDetailId || null;
      this.isStudent = val?.user.userType === 'Student';
    });
  }

  ngOnInit(): void {
    this.getUser();
    this.getAll('');

    this.searchSubject$
      .asObservable()
      .pipe(
        map((val) => val.trim()),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((x) => {
          return this.examService.getAll(x, this.sectionId);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((val) => {
        this.examList.set([...val]);
      });
  }
}
