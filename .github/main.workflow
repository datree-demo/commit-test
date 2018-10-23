workflow "Build and Publish" {
  on = "push"
  resolves = "Publish"
}
