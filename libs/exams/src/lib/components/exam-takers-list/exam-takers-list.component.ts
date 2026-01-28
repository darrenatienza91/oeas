import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExamTakerList } from '@batstateu/data-models';
import { ExamsModule } from '@batstateu/exams';

@Component({
  imports: [ExamsModule],
  selector: 'batstateu-exam-takers-list',
  templateUrl: './exam-takers-list.component.html',
  styleUrls: ['./exam-takers-list.component.less'],
})
export class ExamTakersListComponent implements OnInit {
  @Input() examTakerList: ExamTakerList[] = [];
  @Output() viewScore = new EventEmitter();
  @Output() search = new EventEmitter<string>();
  searchText = '';

  onViewScore(userDetailId: number, examId: number) {
    const takerExamIdObj = { userDetailId: userDetailId, examId: examId }
    this.viewScore.emit(takerExamIdObj);
  }
  onSearchChange(criteria: string) {
    this.search.emit(criteria);
  }
  constructor() { }

  ngOnInit(): void { }
}
