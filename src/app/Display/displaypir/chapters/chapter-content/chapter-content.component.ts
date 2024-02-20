import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DisplaypirService } from 'src/app/services/displaypir.service';
import { Chapter } from 'src/models/Chapter';
import { WordPair } from 'src/models/WordPair';
import { PireditService } from 'src/app/services/piredit.service';
import { Pir } from 'src/models/Pir';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from 'src/app/dialog/dialog.component';

@Component({
  selector: 'app-chapter-content',
  templateUrl: './chapter-content.component.html',
  styleUrls: ['./chapter-content.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ChapterContentComponent implements OnInit {
  @ViewChild('chapterContent') chapterContent!: ElementRef;

  selectedChapterId: any;
  selectedPirId: any;
  selectedChapter!: Chapter;
  selectedPirName!: String;

  fontSize!: number;
  lineHeight!: number;
  isNightMode!: boolean;

  constructor(
    private activeroute: ActivatedRoute,
    private displaypirservice: DisplaypirService,
    private pirService: PireditService,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    this.initialReadMode();
    this.initialFontSetting();
    this.selectedChapterId = await this.activeroute.snapshot.paramMap.get(
      'contentId'
    );
    this.selectedPirId = await this.activeroute.snapshot.paramMap.get('pirId');
    this.retrieveChaptertByChapterId();
  }

  retrieveChaptertByChapterId() {
    this.displaypirservice
      .retrieveChapterByChapterId(this.selectedChapterId, this.selectedPirId)
      .subscribe({
        next: async (chapter: Chapter) => {
          this.selectedChapter = await chapter;

          if (this.selectedChapter.wordPairs !== undefined) {
            //modifies the chapter content adding <b> tag to wordpairs
            for (const wordpair of Object.values(
              this.selectedChapter.wordPairs
            )) {
              this.selectedChapter.chapterContent =
                this.selectedChapter.chapterContent.replace(
                  wordpair.word.trim(),
                  `<b>${wordpair.word.trim()}</b>`
                );
              this.chapterContent.nativeElement.innerHTML =
                this.selectedChapter.chapterContent;
            }

            // adding mouseover event to the <b> tags
            Object.values(
              this.chapterContent.nativeElement.getElementsByTagName('b')
            ).map((el: HTMLElement | any) => {
              el.addEventListener('click', async () => {
                // getting meaning from wordPairs
                const word_: WordPair | any = Object.values(
                  this.selectedChapter.wordPairs
                ).find(
                  (pair: WordPair) => pair.word.trim() === el.innerHTML.trim()
                );
                //popup
                // this.openDialog(word_);
                this.openCustomSnackbar(word_);
              });
            });
          } else {
            this.chapterContent.nativeElement.innerHTML =
              chapter.chapterContent;
          }
          this.getPirNameByPirId();
        },
      });
  }

  getPirNameByPirId() {
    this.pirService.retrievePirByPirId(this.selectedPirId).subscribe({
      next: (pir: Pir) => {
        this.selectedPirName = pir.name;
      },
    });
  }

  openCustomSnackbar(wordpair: WordPair) {
    if (wordpair !== undefined) {
      this.snackBar.openFromComponent(DialogComponent, {
        data: wordpair.meaning,
        duration: 3000,
      });
    }
  }

  increaseFontSize() {
    this.fontSize += 1.3;
    this.lineHeight += 0.09;
    localStorage.setItem('fontSize', this.fontSize.toString());
    localStorage.setItem('lineHeight', this.lineHeight.toString());
  }

  decreaseFontSize() {
    if (this.fontSize > 1) {
      this.fontSize -= 1.3;
      localStorage.setItem('fontSize', this.fontSize.toString());
    }
    if (this.lineHeight > 1) {
      this.lineHeight -= 0.09;
      localStorage.setItem('lineHeight', this.lineHeight.toString());
    }
  }

  initialFontSetting() {
    const fontSizeString = localStorage.getItem('fontSize');
    const lineHeightString = localStorage.getItem('lineHeight');

    this.fontSize = fontSizeString ? parseInt(fontSizeString, 10) : 20;
    this.lineHeight = lineHeightString ? parseFloat(lineHeightString) : 1.7;

    if (isNaN(this.fontSize) || this.fontSize < 1) {
      console.error('Invalid fontSize in localStorage');
      this.fontSize = 20;
    }

    if (isNaN(this.lineHeight) || this.lineHeight < 1) {
      console.error('Invalid lineHeight in localStorage');
      this.lineHeight = 1.7;
    }
  }

  readModeClass(): string {
    return this.isNightMode ? 'night-mode' : 'light-mode';
  }

  initialReadMode() {
    const readMode$ = localStorage.getItem('readMode');

    //if readMode$ null or undefined, it would be 'light-mode'
    localStorage.setItem('readMode', readMode$ ?? 'light-mode');
    this.isNightMode = readMode$ === 'night-mode';
  }

  changeReadMode() {
    this.isNightMode = !this.isNightMode;
    localStorage.setItem(
      'readMode',
      this.isNightMode ? 'night-mode' : 'light-mode'
    );
    this.readModeClass();
  }
}
