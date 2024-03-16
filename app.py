import math

from flask import Flask, jsonify, request
import json
import pandas as pd
import plotly
import plotly.express as px
from flask_cors import CORS

import chatgpt

app = Flask(__name__)

CORS(app, origins=["http://localhost"])

@app.route('/chart', methods=['POST'])
def grap():  # put application's code here
    graph_type = request.json['graphType']
    x_axis = request.json['x']
    if graph_type != 'pie' and graph_type != 'histogram':
        y_axis = request.json['y']
    filter = request.json['filter']
    template = request.json['template']
    jsonData = request.json['data']
    df = pd.DataFrame(jsonData)

    if len(df) < ( len(df) * ( filter / 100 ) ):
        n = len(df)
    else:
        n = ( len(df) * ( filter / 100 ) )

    filtered_df = df.sample(n=int(math.ceil(n)))

    filtered_df = filtered_df.sort_values(by=x_axis) if x_axis in df else df

    if graph_type == 'bar':
        fig = px.bar(filtered_df, x=x_axis, y=y_axis, template=template, color=y_axis)
        image = fig
        highest_value = filtered_df[y_axis].max()
        lowest_value = filtered_df[y_axis].min()
        colors = fig.data[0].marker.color

        text = f"This is a bar graph plotted against {x_axis} on the X-axis and {y_axis} on the Y-axis. "
        text += f"The highest value on the Y-axis is {highest_value}, "
        text += f"the lowest value is {lowest_value}."  # , and The colors used for markers are as follows:\n"
        # for i, color in enumerate(colors):
        #     text += f"Bar {i + 1}: {color}\n"
    elif graph_type == 'pie':
        fig = px.pie(filtered_df, names=x_axis, values=x_axis, template=template, color=x_axis)
        if fig.data and hasattr(fig.data[0], 'labels') and hasattr(fig.data[0], 'values'):
            labels = fig.data[0].labels
            values = fig.data[0].values

            # Convert values to float for comparison and ensure labels are string for display.
            values_float = [value for value in values]
            labels_str = [str(label) for label in labels]

            # Find the index of the maximum and minimum values.
            max_value_index = values_float.index(max(values_float))
            min_value_index = values_float.index(min(values_float))

            # Prepare dynamic parts of the text.
            highest_category = labels_str[max_value_index]
            lowest_category = labels_str[min_value_index]
            highest_value = values_float[max_value_index]
            lowest_value = values_float[min_value_index]

            # Generate dynamic text.
            text = (f"This pie chart visualizes the distribution across different categories of {x_axis}, "
                            f"highlighting {highest_category} as the category with the highest value at {highest_value}, "
                            f"and {lowest_category} as the one with the lowest at {lowest_value}. "
                            "This visualization helps in understanding the relative importance or contribution of each category.")

    elif graph_type == 'scatter':
        fig = px.scatter(filtered_df, x=x_axis, y=y_axis, color=y_axis, template=template)
        image = fig
        text = f"This is a scatter plot with {x_axis} on the X-axis and {y_axis} on the Y-axis. "
        text += "It shows the relationship between the two variables. Look for clusters or patterns in the data points."
    elif graph_type == 'line':
        fig = px.line(filtered_df, x=x_axis, y=y_axis, color=y_axis, template=template)
        image = fig
        text = f"This line chart plots {y_axis} against {x_axis}."
        text += "It is useful for showing trends over time or ordered categories."
    elif graph_type == 'histogram':
        fig = px.histogram(filtered_df, x=x_axis, color=x_axis, template=template)
        image = fig
        text = f"This histogram shows the distribution of {x_axis}. "
        text += "Each bar represents the frequency of data points in each range."

    try:
        # paraphrase = chatgpt.paraphrase(text)
        paraphrase = text
    except:
        paraphrase = text

    fig.update_layout(
        title_text='Data Visualization'
    )

    # fig.show(config={'modeBarButtonsToAdd': ['drawline',
    #                                          'drawopenpath',
    #                                          'drawclosedpath',
    #                                          'drawcircle',
    #                                          'drawrect',
    #                                          'eraseshape'
    #                                          ]})


    html_fig = fig.to_html(config={'scrollZoom': True, 'displayModeBar': True, 'displaylogo': False,
                                                 'modeBarButtonsToRemove': ['select2d, lasso2d'], 'responsive': True})

    # graphJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder, )
    # graphJSON = json.dumps(fig.full_figure_for_development(warn=False), cls=plotly.utils.PlotlyJSONEncoder )

    #
    finalJSON = {
        "graph": f'{html_fig}',
        "text": paraphrase
    }
    #
    return finalJSON
    # return html_fig
    # return graphJSON


if __name__ == '__main__':
    app.run()
