/** @module controller/sidebar/01-canvas */
import { isEmpty } from "../../base/helpers.mjs";
import { CanvasFormView } from "../../forms/enfugue/canvas.mjs";
import { Controller } from "../base.mjs";

/**
 * Extend the Controller to put the form in the sidebar and trigger changes.
 */
class CanvasController extends Controller {
    /**
     * Get state from the form
     */
    getState(includeImages = true) {
        return { "canvas": this.canvasForm.values };
    }
    
    /**
     * Gets default state
     */
    getDefaultState() {
        return {
            "canvas": {
                "tileHorizontal": false,
                "tileVertical": false,
                "width": this.config.model.invocation.width,
                "height": this.config.model.invocation.height,
                "useTiling": false,
                "tilingSize": this.config.model.invocation.tilingSize,
                "tilingStride": this.config.model.invocation.tilingStride,
                "tilingMaskType": this.config.model.invocation.tilingMaskType
            }
        };
    }

    /**
     * Set state on the form
     */
    setState(newState) {
        if (!isEmpty(newState.canvas)) {
            this.canvasForm.setValues(newState.canvas).then(() => this.canvasForm.submit());
        }
    }

    /**
     * On initialize, create form and bind events.
     */
    async initialize() {
        // Create form
        this.canvasForm = new CanvasFormView(this.config);
        this.canvasForm.onSubmit(async (values) => {
            if (!this.images.hasClass("has-sample")) {
                this.images.setDimension(values.width, values.height);
            }
            this.engine.width = values.width;
            this.engine.height = values.height;
            this.engine.tileHorizontal = values.tileHorizontal;
            this.engine.tileVertical = values.tileVertical;
            if (values.useTiling) {
                this.engine.tilingSize = values.tilingSize
                this.engine.tilingMaskType = values.tilingMaskType;
            } else {
                this.engine.tilingSize = 0;
            }
        });

        // Add form to sidebar
        this.application.sidebar.addChild(this.canvasForm);
        
        // Subscribe to model changes to look for defaults
        this.subscribe("modelPickerChange", async (newModel) => {
            if (!isEmpty(newModel)) {
                let defaultConfig = newModel.defaultConfiguration,
                    canvasConfig = {};

                if (!isEmpty(defaultConfig.width)) {
                    canvasConfig.width = defaultConfig.width;
                }
                if (!isEmpty(defaultConfig.height)) {
                    canvasConfig.height = defaultConfig.height;
                }
                if (!isEmpty(defaultConfig.tiling_size)) {
                    canvasConfig.tilingSize = defaultConfig.tiling_size;
                    if (canvasConfig.tilingSize === 0) {
                        canvasConfig.useTiling = false;
                    }
                }
                if (!isEmpty(defaultConfig.tiling_mask_type)) {
                    canvasConfig.tilingMaskType = defaultConfig.tiling_mask_type;
                }

                if (!isEmpty(canvasConfig)) {
                    if (isEmpty(canvasConfig.useTiling)) {
                        canvasConfig.useTiling = true;
                    }
                    await this.canvasForm.setValues(canvasConfig);
                    await this.canvasForm.submit();
                }
            }
        });
        this.subscribe("applicationReady", () => this.canvasForm.submit());
    }
}

export { CanvasController as SidebarController };
