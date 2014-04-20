import importModule from '../../../../spec-utils/import-module';

describe('cards/z-repo-pull-requests/helpers/getAge',function(){

  beforeEach(async function(done){
    this.getAge = (await importModule('elements/cards/z-repo-pull-requests/helpers/getAge')).default;
    done();
  });

  describe('getAge(date:String|Date):{days:Integer, hours:Integer, minutes:Integer}', function(){
    it('returns the of `days`, `hours`, and `minutes` from now', function(){
      var now  = new Date(Date.now()),
          date = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate() - 3,
              now.getHours(),
              now.getMinutes(),
              now.getSeconds(),
              now.getMilliseconds()
            ).toISOString();

      expect(this.getAge(date)).toEqual({
        days: 3,
        hours: 3*24,
        minutes: 3*24*60
      });
    });

    describe('returned values are rounded down to nearest integer', function(){
      it('for `days`',function(){
        var now  = new Date(Date.now()),
            date = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()  - 3,
                now.getHours() - 23,
                now.getMinutes(),
                now.getSeconds(),
                now.getMilliseconds()
              ).toISOString();

        expect(this.getAge(date).days).toEqual(3);
      });

      it('for `hours`',function(){
        var now  = new Date(Date.now()),
            date = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                now.getHours()   - 2,
                now.getMinutes() - 59,
                now.getSeconds(),
                now.getMilliseconds()
              ).toISOString();

        expect(this.getAge(date).hours).toEqual(2);
      });

      it('for `minutes`',function(){
        var now  = new Date(Date.now()),
            date = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                now.getHours(),
                now.getMinutes() - 1,
                now.getSeconds() - 59,
                now.getMilliseconds()
              ).toISOString();

        expect(this.getAge(date).minutes).toEqual(1);
      });
    });
  });
});
