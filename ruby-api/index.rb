# frozen_string_literal: true

require 'yaml'
require 'json'
require 'sinatra'
require 'base64'

before do
  if request.request_method == "POST"
    body_parameters = request.body.read
    params.merge!(JSON.parse(body_parameters))
  end
end

post '/deserialization/yaml' do
  content_type :json

  res = {}
  begin
    res[:result] = YAML.load(params[:yaml]).to_s
  rescue StandardError => e
    res[:error] = e.message
    halt 500, res.to_json
  end

  return res.to_json
end

post '/deserialization/marshal' do
  content_type :json

  res = {}
  begin
    buffer = Base64.decode64(params[:object])
    res[:result] = Marshal.load(buffer).to_s
  rescue StandardError => e
    res[:error] = e.message
    halt 500, res.to_json
  end

  return res.to_json
end
