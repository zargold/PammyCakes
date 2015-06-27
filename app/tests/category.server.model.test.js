'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    Category = mongoose.model('Category');

/**
 * Unit tests
 */
describe('Category Model', function() {

    describe('Saving', function() {
        it('saves new record', function(done) {
            var category = new Category({
                name: 'Cupcakes',
                description: 'Green Tea, Mint Chocolate Chip great for any occasion!'
            });

            category.save(function(err, saved) {
                should.not.exist(err);
                done();
            });
        });

        it('throws validation error when name is empty', function(done) {   
            var category = new Category({
                description: 'Green Tea, Mint Chocolate Chip great for any occasion!'
            });

            category.save(function(err) {
                should.exist(err);
                err.errors.name.message.should.equal('name cannot be blank');
                done();
            });
        });

        it('throws validation error when name longer than 15 chars', function(done) {
            var category = new Category({
                name: 'Chcolate Pizza Party with lots of sprinkles and peanutbutter'
            });

            category.save(function(err, saved) {
                should.exist(err);
                err.errors.name.message.should.equal('name must be 15 chars in length or less');
                done();
            });
        });

        it('throws validation error for duplicate category name', function(done) {
            var category = new Category({
                name: 'Cupcakes'
            });

            category.save(function(err) {
                should.not.exist(err);

                var duplicate = new Category({
                    name: 'Cupcakes'
                });

                duplicate.save(function(err) {
                    err.err.indexOf('$name').should.not.equal(-1);
                    err.err.indexOf('duplicate key error').should.not.equal(-1);
                    should.exist(err);
                    done();
                });
            });
        });
    });

    afterEach(function(done) { 
        // NB this deletes ALL categories (but is run against a test database)
        Category.remove().exec();
        done();
    });
});