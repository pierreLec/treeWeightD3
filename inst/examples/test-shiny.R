library(shiny)
library(treeWeightD3)


fileTree <- system.file("examples/data.csv", package = "treeWeightD3")
dat <-read.csv(fileTree, header = TRUE, sep = ",")

levels <- c("Category", "Level1", "Level2", "Level3", "Level4","Level5")
conditions <- c("COND1","COND2","COND3","COND4")

treeWeightD3Output('treeWeightD3')


server = function(input, output) {
  output$treeWeightD3 <- renderTreeWeightD3(
    treeWeightD3(dat,conditions,levels,"Bacteroides",800,800)
  )
}
ui = shinyUI(fluidPage(
  treeWeightD3Output('treeWeightD3')
))


shinyApp(ui = ui, server = server)

