'use strict';

var supertest = require('supertest');
var app = require('../../server');
var expect = require('expect.js');
var faker = require('faker');
faker.locale = 'fr';

var config = require('../../config/config');

var randomUUID = faker.random.uuid();
var randomId = '293660';
var randomSlug = 'deadpool';
var randomImg = faker.image.image();

var randomIndex_1 = faker.lorem.sentence();
var randomIndex_2 = faker.lorem.sentence();
var randomIndex_3 = faker.lorem.sentence();

function request() {
  return supertest(app.listen());
}

// This agent refers to PORT where program is runninng.
var server = supertest.agent(config.app.url);

// UNIT test begin

describe('CRUD Movie',function(){
  var id

  it('post a movie',function(done){
    // calling home page api
        this.timeout(10000);
    server
    request()
    .post('/api/movie')
    .send({ 
      id_themoviedb: randomId, 
      slug: randomSlug,
      index_1: randomIndex_1,
      index_2: randomIndex_2,
      index_3: randomIndex_3,
      illu: randomImg
    })
    .set('X-app-UUID', randomUUID)
    .set('Content-Type', 'application/json')
    .end(function(err,res){
        //console.log(res.body)
        expect(res.body).to.not.be.empty();
        expect(typeof res.body).to.eql('object')
        expect(res.body.data).to.have.key('slug')
        expect(res.body.meta.code).to.eql(200)  
        id = res.body.data._id
        //console.log(id);
        done();
    });
  });


  it('get a movie - 200',function(done){
        this.timeout(5000);
    server
    request()
    .get('/api/movie/' + id)
    .set('X-app-UUID', randomUUID)
    .set('Content-Type', 'application/json')
    .end(function(err,res){
        //console.log(res.body)
        expect(res.body).to.not.be.empty();
        expect(typeof res.body).to.eql('object')
        expect(res.body.data).to.have.key('_id');
        expect(res.body.data._id).to.eql(id) 
        expect(res.body.meta.code).to.eql(200)       
        done();
    });
  });

  it('get a movie - 404',function(done){
        this.timeout(5000);
    server
    request()
    .get('/api/movie/qsd' + id)
    .set('X-app-UUID', randomUUID)
    .set('Content-Type', 'application/json')
    .end(function(err,res){
        //console.log(res.body)
        //expect(res.body).to.not.be.empty();
        expect(res.body.meta.ok).to.eql(false)
        expect(res.body.meta.code).to.eql(404)       
        done();
    });
  });

  it('get a collection of movies',function(done){
        this.timeout(5000);
    server
    request()
    .get('/api/movies')
    .set('X-app-UUID', randomUUID)
    .set('Content-Type', 'application/json')
    .end(function(err,res){
        //console.log(res.body)
        expect(res.body).to.not.be.empty();
        expect(typeof res.body).to.eql('object')
        expect(err).to.eql(null)
        expect(res.body.data.map(function (item){return item._id})).to.contain(id)  
        expect(res.body.meta.code).to.eql(200)       
        done();
    });
  });
  
  it('update a movie', function(done){
        this.timeout(5000);
    server
    request()
    .put('/api/movie/' + id)
    .send({ 
      id_themoviedb: randomId, 
      slug: randomSlug + '-updated',
      index_1: randomIndex_1,
      index_2: randomIndex_2,
      index_3: randomIndex_3,
      illu: randomImg
    })
    .set('X-app-UUID', randomUUID)
    .set('Content-Type', 'application/json')
    .end(function(err,res){
        //console.log(res.body)
        expect(err).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body.meta.ok).to.eql(true)   
        expect(res.body.meta.code).to.eql(200)       
        done();
    });
  })
  it('checks an updated movie', function(done){
        this.timeout(5000);
      server
      request()
      .get('/api/movie/' + id)
      .set('X-app-UUID', randomUUID)
      .set('Content-Type', 'application/json')
      .end(function(err, res){
        // console.log(res.body)
        expect(err).to.eql(null)
        expect(typeof res.body).to.eql('object')   
        expect(res.body.data._id).to.eql(id)        
        expect(res.body.data.slug).to.eql(randomSlug + '-updated')
        done()
      })
  })
  
  it('removes a movie', function(done){
      this.timeout(5000);
      server
      request()
      .del('/api/movie/' + id)
      .set('X-app-UUID', randomUUID)
      .set('Content-Type', 'application/json')
      .end(function(err, res){
        // console.log(res.body)
        expect(err).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body.meta.ok).to.eql(true) 
        expect(res.body.meta.code).to.eql(200)    
        done()
      })
  })      

});