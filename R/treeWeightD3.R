#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
treeWeightD3 <- function(message, conditions,levels,nodeFind, width = NULL, height = NULL) {

  # forward options using x
  x = list(

    message = message,
    conditions = conditions,
    numberConditions = length(conditions),
    levels = levels,
    nodeFind = nodeFind
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'treeWeightD3',
    x,
    width = width,
    height = height,sizingPolicy = htmlwidgets::sizingPolicy(
    viewer.padding = 0,
    viewer.paneHeight = 500,
    browser.fill = TRUE
    ),
    package = 'treeWeightD3'
  )
}

#' Shiny bindings for treeWeightD3
#'
#' Output and render functions for using treeWeightD3 within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param widtheight Mush,t be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a treeWeightD3
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name treeWeightD3-shiny
#'
#' @export
treeWeightD3Output <- function(outputId, width = '1000', height = '800'){
  htmlwidgets::shinyWidgetOutput(outputId, 'treeWeightD3', width, height, package = 'treeWeightD3')
}

#' @rdname treeWeightD3-shiny
#' @export
renderTreeWeightD3 <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, treeWeightD3Output, env, quoted = TRUE)
}
