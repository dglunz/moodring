require 'test_helper'

class RepoTest < ActiveSupport::TestCase
  test "it can calculate sentiment between 0 and 100" do
    repo = Repo.new(name: "dglunz", owner: "dglunz", private: false)
    sentiment = repo.analyze_sentiment("initial commit")

    assert_includes (0..100).to_a, sentiment
  end

  test "mood color is red at 15 mood" do
    repo = Repo.new(name: "dglunz", owner: "dglunz", private: false, mood: 15)

    assert_equal "#fdbb84", repo.mood_color
  end

   test "mood color is green at 95 mood" do
    repo = Repo.new(name: "dglunz", owner: "dglunz", private: false, mood: 95)

    assert_equal "#99d8c9", repo.mood_color
  end
end
