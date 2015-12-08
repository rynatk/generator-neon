var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);
    this.option('jade');

    this.includeJade = this.options.jade;
  },

  writing: {
    gulpfile: function() {
      this.fs.copyTpl(
        this.templatePath('gulpfile.babel.js'),
        this.destinationPath('gulpfile.babel.js'), {
          includeJade: this.includeJade
        }
      );
    },
    packageJSON: function() {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'), {
          includeJade: this.includeJade
        }
      );
    },
    babelrc: function() {
      this.fs.copy(
        this.templatePath('.babelrc'),
        this.destinationPath('.babelrc')
      );
    },
    git: function() {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
    },
    styles: function() {
      this.fs.copy(
        this.templatePath('screen.sass'),
        this.destinationPath('src/styles/screen.sass')
      );
    },
    scripts: function() {
      this.fs.copy(
        this.templatePath('main.js'),
        this.destinationPath('src/scripts/main.js')
      );
    },
    html: function() {
      var ext = this.includeJade ? 'jade' : 'html';
      this.fs.copyTpl(
        this.templatePath('index.' + ext),
        this.destinationPath('src/index.' + ext), {
          title: this.appname
        }
      );
    }
  },

  install: function() {
    var devDependencies = [
      'babel-core',
      'babel-plugin-transform-class-properties',
      'babel-preset-es2015',
      'babel-preset-react',
      'babelify',
      'bootstrap-sass',
      'browser-sync',
      'browserify',
      'gh-pages',
      'gulp',
      'gulp-sass',
      'gulp-util',
      'vinyl-source-stream'
    ];

    var dependencies = [
      'backbone',
      'jquery',
      'normalize.css',
      'react',
      'react-dom',
      'underscore'
    ];

    if (this.includeJade)
      devDependencies.push('gulp-jade');

    this.npmInstall(
      devDependencies, {
        'saveDev': true
      }
    );

    this.npmInstall(
      dependencies, {
         'save': true
      }
    );
  },

  end: function() {
    this.spawnCommandSync('git', ['init']);
    this.spawnCommandSync('git', ['add', '--all']);
    this.spawnCommandSync('git', ['commit', '-m', '"Init"']);
  }
});
