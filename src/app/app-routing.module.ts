import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayComponent } from './Display/display.component';
import { DisplaypirComponent } from './Display/displaypir/displaypir.component';
import { ChaptersComponent } from './Display/displaypir/chapters/chapters.component';
import { ChapterContentComponent } from './Display/displaypir/chapters/chapter-content/chapter-content.component';

const routes: Routes = [
  { path: '', component: DisplaypirComponent, pathMatch: 'full' },
  {
    path: 'display', children: [
      { path: '', redirectTo: 'displaypir', pathMatch: 'full' },
      { path: 'displaypir', component: DisplaypirComponent },
      { path: 'chapter/:id', component: ChaptersComponent },
      { path: 'chapterContent/:contentId/:pirId', component: ChapterContentComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
