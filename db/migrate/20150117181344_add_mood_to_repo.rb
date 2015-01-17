class AddMoodToRepo < ActiveRecord::Migration
  def change
    add_column :repos, :mood, :integer
  end
end
