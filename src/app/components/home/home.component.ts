import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  isVideoPlaying = false;
  videoUrl: SafeResourceUrl;

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    // Initialize with sanitized YouTube URL
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/Y1ycie72aE8?autoplay=1&mute=1'
    );
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  playVideo(): void {
    this.isVideoPlaying = true;
  }
}
