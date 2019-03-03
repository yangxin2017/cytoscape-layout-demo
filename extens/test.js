(function() {
    var register = function(cy) {
      var layoutname = 'TestLayout'; 
      if (!cy) {
        return;
      } // Can't Register if Cytoscape is Unspecified
  
      // Default Layout Options
      var defaults = {
        padding: 100, // Padding around the layout
        boundingBox: undefined, // Constrain layout bounds; {x1,y1,x2,y2} or {x1,y1,w,h}
        chromPadding: 5, // Ammount of padding at the end of the chrom lines in degrees
        nodeDiameter: 30, // Diameter of the genes, for stacking and spacing
        radWidth: 0.015, // Thickness of the chromosomes lines (in radians)
        logSpacing: false, // Log or linear SNP layout along chromosome
        snpLevels: 3, // How many colors to stripe the snps
  
        // Optional Callbacks
        ready: function() {}, // on layoutready
        stop: function() {} // on layoutstop
      };
  
      // Constructor
      // Options : Object Containing Layout Options
      function TestLayout(options) {
        var opts = (this.options = {});
        for (var i in defaults) {
          opts[i] = defaults[i];
        }
        for (var i in options) {
          opts[i] = options[i];
        }
      }
  
      // Runs the Layout
      TestLayout.prototype.run = function() {
        var layout = this;
        var options = layout.options;
        var cy = options.cy;
  
        // Find the Bounding Box and the Center
        var bb = options.boundingBox || cy.extent();
        if (bb.x2 === undefined) {
          bb.x2 = bb.x1 + bb.w;
        }
        if (bb.w === undefined) {
          bb.w = bb.x2 - bb.x1;
        }
        if (bb.y2 === undefined) {
          bb.y2 = bb.y1 + bb.h;
        }
        if (bb.h === undefined) {
          bb.h = bb.y2 - bb.y1;
        }
        var center = {x: (bb.x1 + bb.x2) / 2, y: (bb.y1 + bb.y2) / 2};

        console.log('画布的边界范围：', bb);
        console.log('画布的中心点：', bb);
  
        // Start the layout
        layout.trigger('layoutstart');
        cy.startBatch();
  
        // Clean up things from previous layout, if there was one
        cy.reset();
        //cy.remove('[type = "chrom"], [type = "snpG"]');
        cy.edges().classes('');
  
        // 循环所有点，随机赋值坐标点
        var nodes = cy.nodes();
        nodes.forEach((n)=>{
            n.position({x: Math.random() * bb.w, y: Math.random() * bb.h});
        });


        if( options.fit ) {
            cy.fit( options.padding );
        }
        // ==================
        // Finish the Layout!
        // ==================
        // End the batch operation
        cy.endBatch();
  
        // Trigger layoutready when each node has had its position set at least once
        layout.one('layoutready', options.ready);
        layout.trigger('layoutready');
  
        // Trigger layoutstop when the layout stops (e.g. finishes)
        layout.one('layoutstop', options.stop);
        layout.trigger('layoutstop');
  
        // Done
        return layout;
      };
  
      // Called on Continuous Layouts to Stop Them Before They Finish
      TestLayout.prototype.stop = function() {
        return this;
      };
  
      // Actually Register the layout!
      cytoscape('layout', layoutname, TestLayout);
    };

    // Expose to Global Cytoscape (i.e. window.cytoscape)
    if (typeof cytoscape !== 'undefined') {
      register(cytoscape);
    }
  })();
  