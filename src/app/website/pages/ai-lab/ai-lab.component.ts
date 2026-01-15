import { Component } from '@angular/core';
import { CodeRoastComponent } from "../code-roast/code-roast.component";
import { SnippetGeneratorComponent } from "../snippet-generator/snippet-generator.component";
import { InterviewArenaComponent } from "../interview-arena/interview-arena.component";

@Component({
  selector: 'app-ai-lab',
  standalone: true,
  imports: [CodeRoastComponent, SnippetGeneratorComponent, InterviewArenaComponent],
  templateUrl: './ai-lab.component.html',
  styleUrl: './ai-lab.component.scss'
})
export class AiLabComponent {

}
