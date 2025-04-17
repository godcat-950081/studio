# **App Name**: DataViz Canvas

## Core Features:

- Data Input: Input area for users to paste CSV or JSON data, along with a file upload button.
- Chart Type Selection: Dropdown menu to select the chart type (bar, pie, line, etc.).
- Chart Preview: Display the generated chart using ECharts in a preview area.
- Chart Refresh: Button to regenerate the chart based on the current data and chart type selection.
- Automated Chart Update: Automatically parse and validate user inputted data, then update the chart.

## Style Guidelines:

- Dark background, similar to Cursor's UI.
- Use a muted color palette with high contrast for readability.
- Accent: Teal (#008080) for interactive elements and highlights.
- Clean and modern sans-serif fonts for code and UI elements.
- Split-screen layout with data input on the left and chart preview on the right.
- Use minimalist icons for actions like refresh and upload.

## Original User Request:
我想使用reactJS做个页面，风格，颜色，字体都类似cursor的界面，暗黑色风格。
这个页面主要想表达如下功能：
1. 让用户输入数据或上传用户的数据文件，点击生成，之后显示数据图表
2. 根据第1点，考虑页面分为左右两部分：
2.1 左边内容包括：1个输入框提示用户可以粘贴csv或json数据格式，输入框中包括一个上传文件的按钮（类似chat gpt那种）；1个下拉框，用户可以选择图表类型（柱状图，饼状图，线性图等）
2.2 右边内容是一个页面预览内容，主要包括一个饼状图表，图表是使用eChats实现的。界面右上角有一个刷新图标按钮。
  