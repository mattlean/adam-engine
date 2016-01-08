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
	badgeId = db.StringProperty(required = True)

### PAGE HANDLERS ###
class MainHandler(webapp2.RequestHandler):
	def get(self):
		self.response.write('Hello world!')

class Leaderboards(webapp2.RequestHandler):
	def get(self):
		templateVals = {
			'lbEntries': db.GqlQuery('SELECT * FROM LBEntry ORDER BY score desc LIMIT 10')
		}

		template = JINJA_ENV.get_template('leaderboards.html')
		self.response.write(template.render(templateVals))

class EndPoint(webapp2.RequestHandler):
	def post(self):
		alias = self.request.get('alias')
		badgeId = self.request.get('badgeId')
		score = int(self.request.get('score'))

		logging.info('New Score Submissions\nAlias: %s\nBadge ID: %s\nScore: %i', alias, badgeId, score)

		newLBEntry = LBEntry(alias=alias, badgeId=badgeId, score=score)
		newLBEntry.put()
		newParticipant = Participant(badgeId=badgeId)
		newParticipant.put()

app = webapp2.WSGIApplication([
	('/', MainHandler),
	('/leaderboards', Leaderboards),
	('/ep', EndPoint)
], debug=True)
