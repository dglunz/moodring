require 'simplecov'
SimpleCov.start

ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
require 'capybara-screenshot/minitest'
require 'minitest/rails/capybara'
require 'vcr'
require 'minitest-vcr'
require 'webmock'

Capybara.app = Moodring::Application
MinitestVcr::Spec.configure!

VCR.configure do |c|
  c.cassette_library_dir = 'test/cassettes'
  c.hook_into :webmock
  c.ignore_hosts '127.0.0.1', 'localhost'
end

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all
  Capybara.javascript_driver = :webkit
  # Add more helper methods to be used by all tests here...
end

