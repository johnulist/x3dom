/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

/* This is only a first stub */

/* ### ParticleSet ### */
x3dom.registerNodeType(
    "ParticleSet",
    "Rendering",
    defineClass(x3dom.nodeTypes.PointSet, //X3DGeometryNode,

        /**
         * Constructor for ParticleSet
         * @constructs x3dom.nodeTypes.ParticleSet
         * @x3d x.x
         * @component Rendering
         * @status experimental
         * @extends x3dom.nodeTypes.X3DGeometryNode
         * @param {Object} [ctx=null] - context object, containing initial settings like namespace
         * @classdesc The ParticleSet is a geometry node used in combination with a ParticleSystem node.
         *  Attention: So far this is only a stub.
         */
            function (ctx) {
            x3dom.nodeTypes.ParticleSet.superClass.call(this, ctx);


            /**
             * Drawing mode: "ViewDirQuads" - Draws quads directed to the viewpoint (default). "Points" - Draw points.
             * "Lines" - Draw lines. These modes must not match the finally supported modes.
             * @var {x3dom.fields.SFString} mode
             * @memberof x3dom.nodeTypes.ParticleSet
             * @initvalue ViewDirQuads
             * @range [ViewDirQuads, Points, Lines, Arrows, ViewerArrows, ViewerQuads, Rectangles]
             * @field x3dom
             * @instance
             */
            this.addField_SFString(ctx, 'mode', 'ViewDirQuads');

            /**
             * Defines the drawing order for the particles. Possible values: "Any" - The order is undefined.
             *  "BackToFront" - Draw from back to front. "FrontToBack" - Draw from front to back.
             * @var {x3dom.fields.SFString} drawOrder
             * @memberof x3dom.nodeTypes.ParticleSet
             * @initvalue Any
             * @range [Any, BackToFront, FrontToBack]
             * @field x3dom
             * @instance
             */
            this.addField_SFString(ctx, 'drawOrder', 'Any');

            /**
             * Stores a Coordinate node containing the coordinates of the particles.
             * @var {x3dom.fields.SFNode} coord
             * @memberof x3dom.nodeTypes.ParticleSet
             * @initvalue null
             * @field x3dom
             * @instance
             */
            //this.addField_SFNode('coord', x3dom.nodeTypes.X3DCoordinateNode);

            /**
             * Stores a Coordinate node containing the second coordinates of the particles.
             * @var {x3dom.fields.SFNode} secCoord
             * @memberof x3dom.nodeTypes.ParticleSet
             * @initvalue null
             * @field x3dom
             * @instance
             */
            this.addField_SFNode('secCoord', x3dom.nodeTypes.X3DCoordinateNode);

            /**
             * Stores a Color node containing the colors of the particles.
             * @var {x3dom.fields.SFNode} color
             * @memberof x3dom.nodeTypes.ParticleSet
             * @initvalue null
             * @field x3dom
             * @instance
             */
            //this.addField_SFNode('color', x3dom.nodeTypes.X3DColorNode);

            /**
             * Stores a Normal node containing the normals of the particles.
             * @var {x3dom.fields.SFNode} normal
             * @memberof x3dom.nodeTypes.ParticleSet
             * @initvalue null
             * @field x3dom
             * @instance
             */
            this.addField_SFNode('normal', x3dom.nodeTypes.Normal);

            /**
             * An MFVec3f field containing the sizes of the particles.
             * @var {x3dom.fields.MFVec3f} size
             * @memberof x3dom.nodeTypes.ParticleSet
             * @field x3dom
             * @instance
             */
            this.addField_MFVec3f(ctx, 'size', []);

            /**
             * An MFInt32 field containing indices which specify the order of the vertices in the "coord" field.
             * @var {x3dom.fields.MFInt32} index
             * @memberof x3dom.nodeTypes.ParticleSet
             * @field x3dom
             * @instance
             */
            this.addField_MFInt32(ctx, 'index', []);

            /**
             * An MFFloat field containing z-values for the texture of a particle (used with 3D textures).
             * @var {x3dom.fields.MFFloat} textureZ
             * @memberof x3dom.nodeTypes.ParticleSet
             * @field x3dom
             * @instance
             */
            this.addField_MFFloat(ctx, 'textureZ', []);

            this._mesh._primType = 'POINTS';    // THINKABOUTME; gen tris or render points?
        },
        {
            nodeChanged: function()
            {
                var coordNode = this._cf.coord.node;
                x3dom.debug.assert(coordNode);
                var positions = coordNode.getPoints();

                var numColComponents = 3;
                var colorNode = this._cf.color.node;
                var colors = new x3dom.fields.MFColor();
                if (colorNode) {
                    colors = colorNode._vf.color;
                    x3dom.debug.assert(positions.length == colors.length);

                    if (x3dom.isa(colorNode, x3dom.nodeTypes.ColorRGBA)) {
                        numColComponents = 4;
                    }
                }

                var normalNode = this._cf.normal.node;
                var normals = new x3dom.fields.MFVec3f();
                if (normalNode) {
                    normals = normalNode._vf.vector;
                }

                this._mesh._numColComponents = numColComponents;
                this._mesh._lit = false;

                this._mesh._indices[0] = this._vf.index.toGL();
                this._mesh._positions[0] = positions.toGL();
                this._mesh._colors[0] = colors.toGL();
                this._mesh._normals[0] = normals.toGL();
                this._mesh._texCoords[0] = [];

                this.invalidateVolume();
                this._mesh._numCoords = this._mesh._positions[0].length / 3;
            },

            fieldChanged: function(fieldName)
            {
                var pnts = null;

                if(fieldName == 'mode')
                {
                }
                else if (fieldName == "coord")
                {
                    pnts = this._cf.coord.node.getPoints();

                    this._mesh._positions[0] = pnts.toGL();

                    this.invalidateVolume();

                    Array.forEach(this._parentNodes, function (node) {
                        node._dirty.positions = true;
                        node.invalidateVolume();
                    });
                }
                else if (fieldName == "color")
                {
                    pnts = this._cf.color.node._vf.color;

                    this._mesh._colors[0] = pnts.toGL();

                    Array.forEach(this._parentNodes, function (node) {
                        node._dirty.colors = true;
                    });
                }
            }
        }
    )
);
