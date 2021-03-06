/*global
    BoundingSphere  :  false,
    Matrix4         :  false,
    Quaternion      :  false,
    TempVars        :  false,
    Transform       :  false,
    UUID            :  false,
    Vector3         :  false,
    EventEmitter    :  false
*/

/**
 * @class
 * An abstract 3D object with a tree-like structure.
 *
 * <p>Inherited position, orientation and scale from Transform represent transformations in local coordinates, relative to the parent node. All transformations applied to a node are recursively applied to its children too.</p>
 *
 * @constructor
 * @extends Transform
 */
function SceneNode() {
    /**
     * @public
     * @type String
     * @see UUID
     */
    this.uuid = UUID.generateCanonicalForm();

    /**
     * @public
     * @type SceneNode
     * @default SceneNode.Origin
     */
    this.parent = SceneNode.Origin;

    /**
     * @public
     * @type Array
     * @default []
     */
    this.children = [];

    this.worldTransform = new Transform();
    this.name = this.uuid;
    this.boundingVolume = new BoundingSphere();
    Transform.call( this );
    EventEmitter.call( this );
}

SceneNode.prototype = {
    constructor: SceneNode,
    /**
     * @public
     * @param {Vector3} [dest]
     * @returns Vector3 dest if specfied, a new Vector3 otherwise.
     */
    getAbsolutePosition: function( dest ) {
        if ( !dest ) {
            dest = new Vector3();
        }
        this._update();
        return dest.set( this.worldTransform.position );
    },
    /**
     * @public
     * @param {Vector3} position
     * @returns SceneNode
     */
    setAbsolutePosition: function( position ) {
        TempVars.lock();
        this.worldTransform.setPosition( position );
        position = TempVars.getVector3().set( position );
        var p = this.parent;
        var q = p.getAbsoluteOrientation( TempVars.getQuaternion() );
        var v = p.getAbsolutePosition( TempVars.getVector3() );
        var s = p.getAbsoluteScale();

        this.position.set( q.inverse().multiplyVector3( position.subtract( v ) ) );
        if ( s != 1 ) {
            this.position.scale( 1 / s );
        }
        TempVars.release();
        return this._invalidate();
    },
    /**
     * @public
     * @param {Quaternion} [dest] Alter dest instead of creating new quaternion.
     * @returns Quaternion dest if specified, new quaternion otherwise.
     */
    getAbsoluteOrientation: function( dest ) {
        if ( !dest ) {
            dest = new Quaternion();
        }
        this._update();
        return this.worldTransform.getOrientation( dest );
    },
    /**
     * @public
     * @param {Quaternion} orientation
     * @returns SceneNode
     */
    setAbsoluteOrientation: function( orientation ) {
        TempVars.lock();
        this.worldTransform.setOrientation( orientation );
        this.orientation.set( this.parent.getAbsoluteOrientation( TempVars.getQuaternion() ).inverse().preMultiply( orientation ) );
        TempVars.release();
        return this._invalidate();
    },
    /**
     * @public
     * @returns Number
     */
    getAbsoluteScale: function() {
        this._update();
        return this.worldTransform.getScale();
    },
    /**
     * @public
     * @param Number scale
     * @returns SceneNode
     */
    setAbsoluteScale: function( scale ) {
        this.worldTransform.setScale( scale );
        this.scale = scale / this.parent.getAbsoluteScale();
        return this._invalidate();
    },
    /**
     * Rotates node around itself or another object.
     * @public
     * @param Array axis A 3-element vector representing the axis.
     * @param Number angle Angle to rotate in radians.
     * @param SceneNode node If specified, rotate around this node.
     * @returns SceneNode
     */
    rotate: function( axis, angle, node ) {
        TempVars.lock();

        //Remap angle to the range 0..2 * Math.PI
        angle -= 2 * Math.PI * Math.floor( angle / 2 / Math.PI );

        //Calculate the quaternion that describes the rotation we want to do
        var rot = TempVars.getQuaternion().setAxisAngle( axis, angle );

        /*
         * If node is undefined then we are rotating around ourself and our position
         * remains unchanged. If it is a node a new position is calculated.
         */
        if ( node ) {
            //Get the absolute position of the node being rotated
            var newPos = this.getAbsolutePosition( TempVars.getVector3() );

            //If we are rotating around SceneNode.Origin things are simple
            if ( node === SceneNode.Origin ) {
                //Rotate our absolute position around the origin
                rot.multiplyVector3( newPos );
            }
            /*
             * If we are rotating around an arbitrary node we need to transform the
             * system so that the node we are rotation around becomes the SceneNode.Origin.
             * We then do the rotation and transform the system back to it's original
             * state.
             */
            else {
                //Get the absolute position of the node around which we are rotating
                var pivotPos = node.getAbsolutePosition( TempVars.getVector3() );
                //Get the absolute orientation of the node around which we are rotating
                var pivotRot = node.getAbsoluteOrientation( TempVars.getQuaternion() );

                /*
                 * Move the rotation point at the origin and apply the inverse rotation of the
                 * node we are rotating around.
                 */
                pivotRot.inverse().multiplyVector3( newPos.subtract( pivotPos ) );

                //Do the rotation as if we where rotating around SceneNode.Origin
                rot.multiplyVector3( newPos );

                //Move back to the original rotation and position
                pivotRot.inverse().multiplyVector3( newPos ).add( pivotPos );
            }
            //Set the position calculated to the node
            this.setAbsolutePosition( newPos );
        }

        //The orientation change is always the same whether we rotate around ourselfs or around a node
        this.orientation.preMultiply( rot );

        TempVars.release();
        return this._invalidate();
    },
    rotateToEuler: function( yaw, pitch, roll ) {
        this.setOrientation( new Quaternion().setEuler( yaw, pitch, roll ) );
    },
    /**
     * @public
     * Moves node relative to its current position or the position of another node.
     * @param Vector3 vector The position transformation vector.
     * @param SceneNode [node] Move relatively to node instead of the current position.
     * @returns SceneNode
     */
    move: function( vector, node ) {
        if ( node ) {
            if ( node == SceneNode.Origin ) {
                TempVars.lock();
                var newPos = this.getAbsolutePosition( TempVars.getVector3() ).add( vector );
                this.setAbsolutePosition( newPos );
                TempVars.release();
                //We don't have to invalidate again. setAbsolutePosition just did it.
                return this;
            }
            else {
                throw 'Not yet implemented';
            }
        }
        else {
            this.position.add( vector );
        }
        return this._invalidate();
    },
    /**
     * @public
     * @param SceneNode node
     * @returns SceneNode
     */
    appendChild: function( node ) {
        if ( node.parent !== SceneNode.Origin ) {
            node.parent.removeChild( node );
        }

        node.parent = this;
        this.children.push( node );
        node._invalidate();

        this.onChildAdded( node );
        return this;
    },
    /**
     * Override this method to process the addition of a node anywhere in the tree below this node.
     * @param SceneNode node The node that was added to the tree.
     */
    onChildAdded: function( node ) {
        this.emit( 'childadded', node );
        if ( this !== SceneNode.Origin ) {
            this.parent.onChildAdded( node );
        }
    },
    /**
     * @public
     * Removes child from list of children and reset child's parent reference to SceneNode.Origin
     * @param {SceneNode} node The node to remove.
     * @returns SceneNode
     */
    removeChild: function( node ) {
        var children = this.children;
        var l = children.length;

        node.parent = SceneNode.Origin;
        node._invalidate();
        children.splice( children.indexOf( node ), 1 );
        this.onChildRemoved( node );

        return this;
    },
    /**
     * @public
     * Override this method to process the removal of a node anywhere in the tree below this node.
     * @params {SceneNode} node The node that wars removed from the tree.
     * @params {SceneNode} parentNode The previous parent of the node.
     */
    onChildRemoved: function( node ) {
        this.emit( 'childremoved', node );
        if ( this !== SceneNode.Origin ) {
            this.parent.onChildRemoved( node );
        }
    },
    /**
     * @public
     * Returns world-coordinate transformation matrix.
     * @param {Matrix4} [dest] Alter dest instead of creating a new matrix.
     * @returns Matrix4 dest if specified, a new matrix otherwise.
     */
    getAbsoluteMatrix: function( dest ) {
        if ( !dest ) {
            dest = new Matrix4();
        }
        this._update();
        return dest.set( this.worldTransform.getMatrix() );
    },
    /**
     * @public
     * Returns the inverse of world-coordinate transformation matrix.
     * @param {Matrix4} [dest] Alter dest instead of creating a new matrix.
     * @returns Matrix4 dest if specified, a new matrix otherwise.
     */
    getAbsoluteInverseMatrix: function( dest ) {
        if ( !dest ) {
            dest = new Matrix4();
        }
        this._update();
        return dest.set( this.worldTransform.getInverseMatrix() );
    },
    _update: function() {
        if ( this._needsUpdate ) {
            this.Transform__update();
            var parent = this.parent;
            parent._update();
            this.worldTransform.set( this ).combineWith( parent.worldTransform );
        }
        return this;
    },
    _invalidate: function() {
        this.Transform__invalidate();
        var l = this.children.length;
        while ( l-- ) {
            this.children[ l ]._invalidate();
        }
        return this;
    },
    getExportData: function( exporter ) {
        var ret = {};
        ret.position = this.getPosition() + '';
        ret.orientation = this.getOrientation() + '';
        ret.scale = this.getScale();
        ret.name = this.name;
        ret.children = [];
        var l = this.children.length;
        while ( l-- ) {
            var child = this.children[ l ];
            ret.children.push( child.name );
            exporter.alsoSave( child );
        }
        return ret;
    },
    setImportData: function( importer, data ) {
        this.name = data.name;
        this.setPosition( new Vector3( data.position ) );
        this.setOrientation( new Quaternion( data.orientation ) );
        this.setScale( data.scale );
        var l = data.children.length;
        while( l-- ) {
            importer.load( data.children[ l ], this.appendChild.bind( this ) );
        }
    }
};

SceneNode.extend( Transform );
SceneNode.extend( EventEmitter );

SceneNode.Origin = new SceneNode();
SceneNode.Origin.parent = SceneNode.Origin; // god
