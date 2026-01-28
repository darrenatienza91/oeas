import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Exam } from '@batstateu/data-models';
import { ExamsService } from '@batstateu/shared';
import { Store } from '@ngrx/store';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as fromAuth from '@batstateu/auth';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  map
} from 'rxjs';
import { ExamListComponent } from '../../components/exam-list/exam-list.component';
@Component({
  imports: [ExamListComponent],
  selector: 'batstateu-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamsComponent implements OnInit {
  criteria = "";
  examList: Exam[] = [];
  sectionId!: number | null;
  userDetailId!: number | null;
  private searchSubject$ = new BehaviorSubject<string>('');
  isStudent!: boolean;
  getAll(criteria: string) {
    this.examService.getAll(criteria, this.sectionId, this.userDetailId).subscribe((val) => {
      this.examList = [...val];
      this.cd.detectChanges();
    });
  }
  onChangeStatus(value: any) {
    this.examService.changeStatus(value.id, !value.status).subscribe(() => {
      this.getAll(this.criteria);
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
    this.store.select(fromAuth.getUser).subscribe((val) => {
      this.sectionId = val?.sectionId;
      this.userDetailId = val?.userDetailId || null;
      this.isStudent = val?.userType === "Student"
    });
  }
  constructor(
    private examService: ExamsService,
    private cd: ChangeDetectorRef,
    private store: Store<fromAuth.State>,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.getAll('');

    this.searchSubject$
      .asObservable()
      .pipe(
        map((val) => val.trim()),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((val) => {
        this.getAll(val);
      });
  }
}
