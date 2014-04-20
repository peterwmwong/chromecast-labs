import ElementInterface from '../../ElementInterface'

export default class ZPullRequestInterface extends ElementInterface {
  constructor(el){ super(el); }

  get zGithubApiEl() { return this.qs('z-github-api'); }

  get name() { return this.qs('.name').childNodes[0].textContent.trim(); }

  get ownerAvatarURL() {
    return /url\((.*?)\)/.exec(this.qs('.owner .avatar').style.backgroundImage)[1];
  }
  get assigneeAvatarURL() {
    return /url\((.*?)\)/.exec(this.qs('.assignee .avatar').style.backgroundImage)[1];
  }

  get devReviewedIndicatorEl(){ return this.qs('.status.code-reviewed'); }
  get isDevReviewed(){
    return this.devReviewedIndicatorEl.classList.contains('s-done');
  }
  get devReviewedTooltipText(){
    return this.devReviewedIndicatorEl.getAttribute('title');
  }

  get testerReviewedIndicatorEl(){ return this.qs('.status.test'); }
  get isTesterReviewed(){
    return this.testerReviewedIndicatorEl.classList.contains('s-done');
  }
  get testerReviewedTooltipText(){
    return this.testerReviewedIndicatorEl.getAttribute('title');
  }

  get isCIFailing(){
    return this.testerReviewedIndicatorEl.classList.contains('s-error');
  }

  get isInactive(){ return /and inactive/.test(this.ageText); }

  get ageEl(){ return this.qs('.age'); }
  get ageText(){ return this.ageEl.textContent.trim(); }
  get isMoldyOld(){ return this.ageEl.classList.contains('s-moldy'); }
  get isStaleOld(){ return this.ageEl.classList.contains('s-stale'); }
}
