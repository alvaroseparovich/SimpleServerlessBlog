export interface appSyncEvent {
  arguments: any;
  identity:  null;
  source:    null;
  request:   Request;
  prev:      null;
  info:      Info;
  stash:     Stash;
}

export interface Info {
  selectionSetList:    string[];
  selectionSetGraphQL: string;
  fieldName:           string;
  parentTypeName:      string;
  variables:           Stash;
}

export interface Stash {
}

export interface Request {
  headers:    Headers;
  domainName: null;
}

export interface Headers {
  "x-forwarded-for":              string;
  "cloudfront-viewer-country":    string;
  "cloudfront-is-tablet-viewer":  string;
  "x-amzn-requestid":             string;
  via:                            string;
  "cloudfront-forwarded-proto":   string;
  origin:                         string;
  "content-length":               string;
  "x-forwarded-proto":            string;
  host:                           string;
  "accept-language":              string;
  "sec-gpc":                      string;
  "user-agent":                   string;
  "cloudfront-is-mobile-viewer":  string;
  accept:                         string;
  "cloudfront-is-smarttv-viewer": string;
  "accept-encoding":              string;
  referer:                        string;
  "content-type":                 string;
  "x-api-key":                    string;
  "sec-fetch-mode":               string;
  "x-amz-cf-id":                  string;
  "x-amzn-trace-id":              string;
  "sec-fetch-dest":               string;
  "x-amz-user-agent":             string;
  "cloudfront-is-desktop-viewer": string;
  "sec-fetch-site":               string;
  "x-forwarded-port":             string;
}
