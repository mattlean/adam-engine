#!/usr/bin/env python

import jinja2
import json
import logging
import os
import webapp2
from google.appengine.ext import db

JINJA_ENV = jinja2.Environment(
	loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
	extensions=['jinja2.ext.autoescape'],
	autoescape=True)

### MODELS ###
class LBEntry(db.Model):
	alias = db.StringProperty(required = True)
	badgeId = db.StringProperty(required = True)
	score = db.IntegerProperty(required = True)
	created = db.DateTimeProperty(auto_now_add = True)
	modified = db.DateTimeProperty(auto_now = True)

class Participant(db.Model):
	submitted = db.IntegerProperty(required = True)
	prizeWon = db.BooleanProperty(required = True)
	created = db.DateTimeProperty(auto_now_add = True)
	modified = db.DateTimeProperty(auto_now = True)

### PAGE HANDLERS ###
class MainHandler(webapp2.RequestHandler):
	def get(self):
		self.response.write('Hello world!')

class Leaderboards(webapp2.RequestHandler):
	def get(self):
		templateVals = {
			'lbEntries': db.GqlQuery('SELECT * FROM LBEntry ORDER BY score desc LIMIT 20')
		}

		template = JINJA_ENV.get_template('leaderboards.html')
		self.response.write(template.render(templateVals))

class HighScorers(webapp2.RequestHandler):
	def get(self):
		templateVals = {
			'lbEntries': db.GqlQuery('SELECT * FROM LBEntry ORDER BY score desc LIMIT 20')
		}

		template = JINJA_ENV.get_template('highscorers.html')
		self.response.write(template.render(templateVals))

class Badges(webapp2.RequestHandler):
	def get(self):
		templateVals = {
			'participants': db.GqlQuery('SELECT * FROM Participant ORDER BY created desc')
		}

		template = JINJA_ENV.get_template('badges.html')
		self.response.write(template.render(templateVals))

class EndPoint(webapp2.RequestHandler):
	def post(self):
		alias = self.request.get('alias')
		badgeId = self.request.get('badgeId')
		score = int(self.request.get('score'))

		logging.info('New Score Submissions\nAlias: %s\nBadge ID: %s\nScore: %i', alias, badgeId, score)

		newLBEntry = LBEntry(alias=alias, badgeId=badgeId, score=score)

		participant = Participant.get_by_key_name(badgeId)

		if(participant == None):
			# participant doesn't exist, create new
			participant = Participant(key_name=badgeId, submitted=0, prizeWon=False)
		else:
			# participant exists, add to submission counter
			participant.submitted = participant.submitted + 1

		participant.put()
		newLBEntry.put()

app = webapp2.WSGIApplication([
	('/', MainHandler),
	('/leaderboards', Leaderboards),
	('/manage/highscorers', HighScorers),
	('/manage/badges', Badges),
	('/ep', EndPoint)
], debug=True)
