import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExamTakerResultList } from '@batstateu/data-models';
import { ExamsModule } from '@batstateu/exams';

@Component({
  imports: [ExamsModule],
  selector: 'batstateu-exam-result-list',
  templateUrl: './exam-result-list.component.html',
  styleUrls: ['./exam-result-list.component.less']
})
export class ExamResultListComponent implements OnInit {
  @Input() examTakerResultList: ExamTakerResultList[] = [];
  @Output() search = new EventEmitter<string>();
  searchText = '';
  onSearchChange(criteria: string) {
    this.search.emit(criteria);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
