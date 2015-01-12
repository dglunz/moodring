class RemoveGhubFromUser < ActiveRecord::Migration
  def change
    remove_column :users, :ghub
  end
end
