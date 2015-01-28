require "test_helper"

class RepositoryMoodTest < Capybara::Rails::TestCase
  describe "Repository mood" do
    it "calculates mood for given repository", :js do
      VCR.use_cassette("poptarts", match_requests_on: [:host], record: :once) do
        visit root_path
        fill_in 'repo_owner', with: 'dglunz'
        fill_in 'repo_name', with: 'moodring'
        find('text').click

        sleep(10)
        assert page.has_content?("Sentiment")
        assert Repo.last.mood
      end
    end

    it "returns a badge dependant on the repo mood" do
      repo = Repo.create!(owner: "dglunz", name: "moodring", private: false, mood: 90)

      visit "repos/#{repo.id}/badge.svg"

      assert page.has_content?("90")
    end

    it "saves the mood on the Repo table after loading", :js do
      skip
      repo = Repo.create!(owner: "dglunz", name: "moodring", private: false)

      visit repo_path(repo)

      sleep(10)
      screenshot_and_save_page
      assert repo.mood
    end
  end
end
