module TimeTracker
  def self.track_time(name, &block)
    Rails.logger.info("************* STARTING #{name} ************")
    start = Time.now
    result = yield block
    Rails.logger.info("************* FINISHED #{name} ************")
    Rails.logger.info("**** ELAPSED: #{Time.now - start}")
    result
  end
end
