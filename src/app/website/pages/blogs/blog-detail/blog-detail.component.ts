import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Blog, BlogService } from '../blog.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss'
})
export class BlogDetailComponent {
    blog!: Blog | undefined;

  constructor(private route: ActivatedRoute, private blogService: BlogService) {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.blog = this.blogService.getBlogBySlug(slug!);
  }
}
