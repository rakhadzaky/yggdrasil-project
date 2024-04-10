import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FamilyTree from "../../../../Helpers/familytree.js";
import './graphTree.css'

export default class GraphTree extends Component {

  constructor(props) {
      super(props);
      this.divRef = React.createRef();
  }

  shouldComponentUpdate() {
      return false;
  }

  componentDidMount() {
    FamilyTree.templates.myTemplate = Object.assign({}, FamilyTree.templates.tommy);
    FamilyTree.templates.myTemplate.size = [200, 300];
    FamilyTree.templates.myTemplate.html = '{val}';
    FamilyTree.templates.myTemplate_male = Object.assign({}, FamilyTree.templates.myTemplate);
    FamilyTree.templates.myTemplate_female = Object.assign({}, FamilyTree.templates.myTemplate);
      this.chart = new FamilyTree (this.divRef.current , {
          nodes: this.props.nodes,
          nodeMouseClick: FamilyTree.action.none,
          template: 'myTemplate',

          nodeBinding: {
              html: 'html',
          }
      });

      this.chart.on('field', function ( sender, args) {
        if (args.name == 'html') {
          var name = args.data["name"];
          var link = args.data["link"];
          var img = args.data["img"];
          var age = args.data["age"];
          args.value = `
          <foreignobject x="0" y="0" width="${args.node.w}" height="${args.node.h}">
            <div class="card" style="width: 100%; height: 100%">
              <img class="card-img-top" src="${img}" alt="Card image cap">
              <div class="card-body">
                <p class="card-text" style="margin:0">
                  <a class="title" href=" ${link} ">${name}</a>
                  <p class="desc">
                  <i class="bi bi-balloon"></i> ${age} years old
                  </p>
                </p>
              </div>
            </div>
          </foreignobject>
          `;
        }
      })
  }

  render() {
      return (
        <>
          <div id="tree" style={{minHeight: "90vh"}} ref={this.divRef}></div>
        </>
      );
  }

}

GraphTree.propTypes = {
  nodes: PropTypes.any,
};