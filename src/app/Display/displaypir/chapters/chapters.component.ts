import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DisplaypirService } from 'src/app/services/displaypir.service';
import { Pir } from 'src/models/Pir';

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.css']
})
export class ChaptersComponent implements OnInit {
  selectedPirId: any;
  pir!: Pir
  chaptersNames!: any[]

  constructor(
    private activeroute: ActivatedRoute,
    private displaypirservice: DisplaypirService
  ) {
  }

  async ngOnInit() {
    this.selectedPirId = await this.activeroute.snapshot.paramMap.get('id');

    await this.retrieveChaptersNamesByPirId();
  }


  async retrieveChaptersNamesByPirId() {
    await this.displaypirservice.retrieveChaptersNamesByPirId(this.selectedPirId).subscribe({
      next: async (data) => {
        this.chaptersNames = data
      }
    })
  }
}
