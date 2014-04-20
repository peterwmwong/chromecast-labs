import importModule from '../../../../spec-utils/import-module';
import mockComments from '../../../../data/z-github-api/mock-data/comments';

describe("cards/z-repo-pull-requests/helpers/getStatusFromComments", function(){
  var LGTMComments = ['LGTM',':+1:','Looks good to me'];

  beforeEach(async function(done){
    this.getAgeSpy = jasmine.createSpy('getAge');
    this.getStatusFromComments = (
        await importModule("elements/cards/z-repo-pull-requests/helpers/getStatusFromComments", {
          'elements/cards/z-repo-pull-requests/helpers/getAge': {
            'default': this.getAgeSpy
          }
        })
      ).default;
    done();
  });

  describe("getStatusFromComments(comments:[object]):{ci?:object, tester?:object, dev?:object}", function(){
    beforeEach(function(){
      this.getAgeSpy.and.returnValue({});
    })

    it("returns {hasRecentActivity:false} when `comments` is empty", function(){
      expect(this.getStatusFromComments([])).toEqual({hasRecentActivity: false});
    });

    describe("`hasRecentActivity` Whether or not the PR is actively being developed or tested", function(){
      it("is `true` when last comment was made less than 2 days ago", function(){
        this.getAgeSpy.and.returnValue({days: 1});

        this.lastComment = mockComments.dev;
        var result = this.getStatusFromComments([
          mockComments.tester,
          mockComments.devLGTM,
          mockComments.ciPass,
          mockComments.ciFail,
          this.lastComment
        ]);
        expect(result.hasRecentActivity).toBe(true);
        expect(this.getAgeSpy).toHaveBeenCalledWith(this.lastComment.updated_at);
      });

      it("is `false` when last comment was made >=2 days ago", function(){
        this.lastComment = mockComments.dev;
        var comments = [
            mockComments.tester,
            mockComments.devLGTM,
            mockComments.ciPass,
            mockComments.ciFail,
            this.lastComment
          ]
        this.getAgeSpy.and.returnValue({days: 2});

        var result = this.getStatusFromComments(comments);

        expect(result.hasRecentActivity).toBe(false);
        expect(this.getAgeSpy).toHaveBeenCalledWith(this.lastComment.updated_at);

        this.getAgeSpy.calls.reset();
        this.getAgeSpy.and.returnValue({days: 3});

        result = this.getStatusFromComments(comments);

        expect(result.hasRecentActivity).toBe(false);
        expect(this.getAgeSpy).toHaveBeenCalledWith(this.lastComment.updated_at);
      });
    });

    describe("`tester` Tester review status", function(){
      it("is `undefined` when `comments` doesn't contain any tester review LGTM comments", function(){
        var result = this.getStatusFromComments([]);
        expect(result.tester).toBeUndefined();

        result = this.getStatusFromComments([
            mockComments.dev,
            mockComments.devLGTM,
            mockComments.ciPass,
            mockComments.ciFail,
            mockComments.tester
          ]);
        expect(result.tester).toBeUndefined();
      });

      LGTMComments.forEach((reviewComment)=>{
        describe(`When the \`comments\` contains a tester review LGTM comment '${reviewComment}'`, function(){
          beforeEach(function(){
            this.testerComment = mockComments.testerLGTM;
            this.result = this.getStatusFromComments([
                this.testerComment
              ]);
          });

          it("`tester.reviewed` is `true`", function(){
            expect(this.result.tester.reviewed).toBe(true);
          });

          it("`tester.comment.url` is the URL to the comment", function(){
            expect(this.result.tester.comment.url).toBe(this.testerComment.html_url);
          });

          it("`tester.comment.tooltip` is the tooltip text for the comment", function(){
            expect(this.result.tester.comment.tooltip).toBe(
              `@${this.testerComment.user.login}: ${this.testerComment.body}`
            );
          });
        });
      });
    });

    describe("`dev` Developer review status", function(){
      it("is `undefined` when `comments` doesn't contain any developer LGTM comments", function(){
        var result = this.getStatusFromComments([]);
        expect(result.dev).toBeUndefined();

        result = this.getStatusFromComments([
            mockComments.tester,
            mockComments.testerLGTM,
            mockComments.ciPass,
            mockComments.ciFail,
            mockComments.dev
          ]);
        expect(result.dev).toBeUndefined();
      });

      LGTMComments.forEach((reviewComment)=>{
        describe(`When the \`comments\` contains a developer review LGTM comment '${reviewComment}'`, function(){
          beforeEach(function(){
            this.devComment = mockComments.devLGTM;
            this.result = this.getStatusFromComments([
                this.devComment
              ]);
          });

          it("`dev.reviewed` is `true`", function(){
            expect(this.result.dev.reviewed).toBe(true);
          });

          it("`dev.comment.url` is the URL to the comment", function(){
            expect(this.result.dev.comment.url).toBe(this.devComment.html_url);
          });

          it("`dev.comment.tooltip` is the tooltip text for the comment", function(){
            expect(this.result.dev.comment.tooltip).toBe(
              `@${this.devComment.user.login}: ${this.devComment.body}`
            );
          });
        });
      });
    });

    describe("`ci` CI build status", function(){
      it("is `undefined` when `comments` doesn't contain any CI comments", function(){
        var result = this.getStatusFromComments([]);
        expect(result.ci).toBeUndefined();

        result = this.getStatusFromComments([
            mockComments.dev,
            mockComments.devLGTM,
            mockComments.tester,
            mockComments.testerLGTM
          ]);
        expect(result.ci).toBeUndefined();
      });

      describe("When the last CI comment is 'passing'", function(){
        beforeEach(function(){
          this.lastPassingComment = mockComments.ciPass;
          this.result = this.getStatusFromComments([
              mockComments.ciPass,
              mockComments.ciFail,
              this.lastPassingComment
            ]);
        });

        it("`ci.passing` is `true`", function(){
          expect(this.result.ci.passing).toBe(true);
        });

        it("`ci.comment.url` is the URL to the comment", function(){
          expect(this.result.ci.comment.url).toBe(this.lastPassingComment.html_url);
        });

        it("`ci.comment.tooltip` is the tooltip text for the comment", function(){
          expect(this.result.ci.comment.tooltip).toBe(
            `@${this.lastPassingComment.user.login}: ${this.lastPassingComment.body}`
          );
        });
      });

      describe("When the last CI comment is 'failing'", function(){
        beforeEach(function(){
          this.lastFailingComment = mockComments.ciFail;
          this.result = this.getStatusFromComments([
              mockComments.ciFail,
              mockComments.ciPass,
              this.lastFailingComment
            ]);
        });

        it("`ci.passing` is `false`", function(){
          expect(this.result.ci.passing).toBe(false);
        });

        it("`ci.comment.url` is the URL to the comment", function(){
          expect(this.result.ci.comment.url).toBe(this.lastFailingComment.html_url);
        });

        it("`ci.comment.tooltip` is the tooltip text for the comment", function(){
          expect(this.result.ci.comment.tooltip).toBe(
            `@${this.lastFailingComment.user.login}: ${this.lastFailingComment.body}`
          );
        });

      });
    });
  });
});
