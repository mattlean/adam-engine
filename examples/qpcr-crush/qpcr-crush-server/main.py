#!/usr/bin/env python

import json
import logging
import webapp2
from google.appengine.ext import db

class LBEntry(db.Model):
	alias = db.StringProperty(required = True)
	badgeId = db.StringProperty(required = True)
	score = db.IntegerProperty(required = True)
	created = db.DateTimeProperty(auto_now_add = True)
	modified = db.DateTimeProperty(auto_now = True)

class Participant(db.Model):
	badgeId = db.StringProperty(required = True)

class MainHandler(webapp2.RequestHandler):
	def get(self):
		self.response.write('Hello world!')

class EndPoint(webapp2.RequestHandler):
	def post(self):
		formData = self.request.get('formData')
		json.loads(formData)
		logging.info(formData)

		# self.response.write(int(score))
		# self.response.write(type(int(score)))

		# newLBEntry = LBEntry(alias=alias, badgeId=badgeId, score=score)
		# newLBEntry.put()
		# newParticipant = Participant(badgeId=badgeId)
		# newParticipant.put()

app = webapp2.WSGIApplication([
	('/', MainHandler),
	('/ep', EndPoint)
], debug=True)
