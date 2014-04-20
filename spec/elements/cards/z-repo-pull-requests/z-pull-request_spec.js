import createElement         from '../../../spec-utils/create-element';
import mockElement           from '../../../spec-utils/mock-element';
import mockComments          from '../../../data/z-github-api/mock-data/comments';
import mockPullRequests      from '../../../data/z-github-api/mock-data/pullRequests';
import ZPullRequestInterface from './ZPullRequestInterface';

describe('cards/z-repo-pull-requests/z-pull-request', function(){

  beforeEach(async function(done){
    this.mockPullRequest = mockPullRequests.pullRequest;

    await mockElement({name:'z-github-api', attributes:'path response'});
    this.ei = new ZPullRequestInterface(
      await createElement('<z-pull-request pullRequest="{{pullRequest}}"/>',
                          {pullRequest:this.mockPullRequest})
    );

    done();
  });

  it("uses <z-github-api> to retrieve pull request comments", function(){
    expect(this.ei.zGithubApiEl.attributes.path.value)
      .toBe(`repos/${ this.mockPullRequest.head.repo.full_name }/issues/${ this.mockPullRequest.number }/comments`);
  });

  it("displays pull request's name", function(){
    expect(this.ei.name).toEqual(this.mockPullRequest.title);
  });

  describe("displays pull request's age", function(){
    it("in days", async function(done){
      var now  = new Date(Date.now());
      var testPullRequest = mockPullRequests.pullRequest;

      testPullRequest.created_at = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 3,
          now.getHours(),
          now.getMinutes(),
          now.getSeconds(),
          now.getMilliseconds()
        ).toISOString();
      this.ei.el.pullRequest = testPullRequest;

      await platformFlush();
      expect(this.ei.ageText).toBe('3 days old');

      done();
    });

    it("in hours", async function(done){
      var now  = new Date(Date.now());
      var testPullRequest = mockPullRequests.pullRequest;
      testPullRequest.created_at = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours() - 4,
          now.getMinutes(),
          now.getSeconds(),
          now.getMilliseconds()
        ).toISOString();
      this.ei.el.pullRequest = testPullRequest;

      await platformFlush();
      expect(this.ei.ageText).toBe('4 hours old');

      done();
    });

    it("in minutes", async function(done){
      var now  = new Date(Date.now());
      var testPullRequest = mockPullRequests.pullRequest;
      testPullRequest.created_at = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours(),
          now.getMinutes() - 5,
          now.getSeconds(),
          now.getMilliseconds()
        ).toISOString();
      this.ei.el.pullRequest = testPullRequest;

      await platformFlush();
      expect(this.ei.ageText).toBe('5 minutes old');

      done();
    });

    it("adds 'and is inactive' when the last PR comment is more than day old", async function(done){
      var now  = new Date(Date.now());
      var lastComment = mockComments.ciPass;
      lastComment.updated_at = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 2,
          now.getHours(),
          now.getMinutes(),
          now.getSeconds(),
          now.getMilliseconds()
        ).toISOString();
      this.ei.zGithubApiEl.response = [lastComment]

      await platformFlush();
      expect(this.ei.isInactive).toBe(true);

      done();
    });

    it("adds 's-moldy' CSS class when age is greater than 7 days old", async function(done){
      var now  = new Date(Date.now());
      var testPullRequest = mockPullRequests.pullRequest;
      testPullRequest.created_at = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 8,
          now.getHours(),
          now.getMinutes(),
          now.getSeconds(),
          now.getMilliseconds()
        ).toISOString();
      this.ei.el.pullRequest = testPullRequest;

      await platformFlush();
      expect(this.ei.isMoldyOld).toBe(true);
      expect(this.ei.isStaleOld).toBe(false);

      done();
    });

    it("adds 's-stale' CSS class when age is greater than 2 days old", async function(done){
      var now  = new Date(Date.now());
      var testPullRequest = mockPullRequests.pullRequest;
      testPullRequest.created_at = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 3,
          now.getHours(),
          now.getMinutes(),
          now.getSeconds(),
          now.getMilliseconds()
        ).toISOString();
      this.ei.el.pullRequest = testPullRequest;

      await platformFlush();
      expect(this.ei.isMoldyOld).toBe(false);
      expect(this.ei.isStaleOld).toBe(true);

      testPullRequest = mockPullRequests.pullRequest;
      testPullRequest.created_at = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 2,
          now.getHours(),
          now.getMinutes(),
          now.getSeconds(),
          now.getMilliseconds()
        ).toISOString();
      this.ei.el.pullRequest = testPullRequest;

      await platformFlush();
      expect(this.ei.isMoldyOld).toBe(false);
      expect(this.ei.isStaleOld).toBe(false);

      done();
    });
  });

  it("displays pull request's owner's avatar", function(){
    expect(this.ei.ownerAvatarURL)
      .toEqual(this.mockPullRequest.user.avatar_url);
  });

  it("displays pull request's assignee's avatar", function(){
    expect(this.ei.assigneeAvatarURL)
      .toEqual(this.mockPullRequest.assignee.avatar_url);
  });

  describe("displays the code review status", function(){

    it("as not done with a tooltip of 'No Dev LGTM comment found!'", function(){
      expect(this.ei.isDevReviewed).toBe(false);
      expect(this.ei.devReviewedTooltipText).toBe('No Dev LGTM comment found!');
    });

    it("as done with a tooltip when PR has been code reviewed", async function(done){
      var devLGTMComment = mockComments.devLGTM;
      this.ei.zGithubApiEl.response = [devLGTMComment];
      await platformFlush();

      expect(this.ei.isDevReviewed).toBe(true);
      expect(this.ei.devReviewedTooltipText).toBe(
        `@${devLGTMComment.user.login}: ${devLGTMComment.body}`
      );
      done();
    });
  });

  describe("displays the tester review status", function(){

    it("as not done with a tooltip of 'No Tester LGTM comment found!'", function(){
      expect(this.ei.isTesterReviewed).toBe(false);
      expect(this.ei.testerReviewedTooltipText)
        .toBe('No Tester LGTM comment found!');
    });

    it("as done with a tooltip when PR has been code reviewed", async function(done){
      var testerLGTMComment = mockComments.testerLGTM;
      this.ei.zGithubApiEl.response = [testerLGTMComment];
      await platformFlush();

      expect(this.ei.isTesterReviewed).toBe(true);
      expect(this.ei.testerReviewedTooltipText).toBe(
        `@${testerLGTMComment.user.login}: ${testerLGTMComment.body}`
      );
      done();
    });
  });

  describe("displays the CI build status", function(){

    it("overrides test review status when CI build is failing", async function(done){
      var ciFailComment = mockComments.ciFail;
      this.ei.zGithubApiEl.response = [ciFailComment];
      await platformFlush();

      expect(this.ei.isTesterReviewed).toBe(false);
      expect(this.ei.isCIFailing).toBe(true);
      expect(this.ei.testerReviewedTooltipText).toBe(
        `@${ciFailComment.user.login}: ${ciFailComment.body}`
      );
      done();
    });
  });
});
