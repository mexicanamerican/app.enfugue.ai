/** @module forms/input/enfugue/models */
import { isEmpty, deepClone, createElementsFromString } from "../../../base/helpers.mjs";
import { FormView } from "../../base.mjs";
import { StringInputView, TextInputView } from "../string.mjs";
import { NumberInputView, FloatInputView } from "../numeric.mjs";
import { FormInputView, RepeatableInputView } from "../parent.mjs";
import {
    SelectInputView,
    SearchListInputView,
    SearchListInputListView
} from "../enumerable.mjs";

let defaultEngineSize = 512;

/**
 * Engine size input
 */
class EngineSizeInputView extends NumberInputView {
    /**
     * @var int Minimum pixel size
     */
    static min = 128;

    /**
     * @var int Maximum pixel size
     */
    static max = 2048;

    /**
     * @var int Multiples of 8
     */
    static step = 8;

    /**
     * @var int The default value
     */
    static defaultValue = defaultEngineSize;
    
    /**
     * @var string The tooltip to display to the user
     */
    static tooltip = "When using chunked diffusion, this is the size of the window (in pixels) that will be encoded, decoded or inferred at once. Set the chunking size to 0 in the sidebar to disable chunked diffusion and always try to process the entire image at once.";
};

/**
 * VAE Input View
 */
class VAEInputView extends SelectInputView {
    /**
     * @var object Option values and labels
     */
    static defaultOptions = {
        "ema": "EMA 560000",
        "mse": "MSE 840000",
        "xl": "SDXL",
        "xl16": "SDXL FP16"
    };
    
    /**
     * @var string Default text
     */
    static placeholder = "Default";

    /**
     * @var bool Allow null
     */
    static allowEmpty = true;

    /**
     * @var string Tooltip to display
     */
    static tooltip = "Variational Autoencoders are the model that translates images between pixel space - images that you can see - and latent space - images that the AI model understands. In general you do not need to select a particular VAE model, but you may find slight differences in sharpness of resulting images.";
};

/**
 * Scheduler Input View
 */
class SchedulerInputView extends SelectInputView {
    /**
     * @var object Option values and labels
     */
    static defaultOptions = {
        "ddim": "DDIM: Denoising Diffusion Implicit Models",
        "ddpm": "DDPM: Denoising Diffusion Probabilistic Models",
        "deis": "DEIS: Diffusion Exponential Integrator Sampler",
        "dpmsm": "DPM-Solver++ Multi-Step",
        "dpmss": "DPM-Solver++ Single-Step",
        "heun": "Heun Discrete Scheduler",
        "dpmd": "DPM Discrete Scheduler",
        "adpmd": "DPM Ancestral Discrete Scheduler",
        "dpmsde": "DPM Solver SDE Scheduler",
        "unipc": "UniPC: Predictor (UniP) and Corrector (UniC)",
        "lmsd": "LMS: Linear Multi-Step Discrete Scheduler",
        "pndm": "PNDM: Pseudo Numerical Methods for Diffusion Models",
        "eds": "Euler Discrete Scheduler",
        "eads": "Euler Ancestral Discrete Scheduler",
    };

    /**
     * @var string The tooltip
     */
    static tooltip = "Schedulers control how an image is denoiser over the course of the inference steps. Schedulers can have small effects, such as creating 'sharper' or 'softer' images, or drastically change the way images are constructed. Experimentation is encouraged, if additional information is sought, search <strong>Diffusers Schedulers</strong> in your search engine of choice.";
    
    /**
     * @var string Default text
     */
    static placeholder = "Default";

    /**
     * @var bool Allow null
     */
    static allowEmpty = true;
};


/**
 * Limit options for multidiffusion scheduler
 */
class MultiDiffusionSchedulerInputView extends SelectInputView {
    /**
     * @var object Option values and labels
     */
    static defaultOptions = {
        "ddim": "DDIM: Denoising Diffusion Implicit Models (Recommended)",
        "eds": "Euler Discrete Scheduler (Recommended)",
        "ddpm": "DDPM: Denoising Diffusion Probabilistic Models (Blurrier)",
        "eads": "Euler Ancestral Discrete Scheduler (Blurrier)",
        "deis": "DEIS: Diffusion Exponential Integrator Sampler (Distorted)",
        "dpmsm": "DPM-Solver++ Multi-Step (Distorted)",
        "dpmss": "DPM-Solver++ Single-Step (Distorted)",
    };

    /**
     * @var string The tooltip
     */
    static tooltip = "During chunked diffusion (also called multi-diffusion or sliced diffusion,) each denoising step is performed multiple times over different windows of the image. This necessitates that the scheduler be capable of stepping backward as well as forward, and not all schedulers were designed with this in mind. The schedulers in this list are supported during multi-diffusion, but only two are recommended: DDIM, which is the default scheduler for SD 1.5, and Euler Discrete, which is the default scheduler for SDXL.";
    
    /**
     * @var string Default text
     */
    static placeholder = "Default";

    /**
     * @var bool Allow null
     */
    static allowEmpty = true;
};

/**
 * Add text for inpainter engine size
 */
class InpainterEngineSizeInputView extends EngineSizeInputView {
    /**
     * @var string The tooltip to display to the user
     */
    static tooltip = "This engine size functions the same as the base engine size, but only applies when inpainting.\n\n" + EngineSizeInputView.tooltip;

    /**
     * @var ?int no default value
     */
    static defaultValue = null;
};

/**
 * Add text for refiner engine size
 */
class RefinerEngineSizeInputView extends EngineSizeInputView {
    /**
     * @var string The tooltip to display to the user
     */
    static tooltip = "This engine size functions the same as the base engine size, but only applies when refining.\n\n" + EngineSizeInputView.tooltip;

    /**
     * @var ?int no default value
     */
    static defaultValue = null;
};

/**
 * Inversion input - will be populated at init.
 */
class InversionInputView extends SearchListInputView {};

/**
 * LoRA input - will be populated at init.
 */
class LoraInputView extends SearchListInputView {};

/**
 * LyCORIS input - will be populated at init.
 */
class LycorisInputView extends SearchListInputView {};

/**
 * Checkpoint input - will be populated at init.
 */
class CheckpointInputView extends SearchListInputView {};

/**
 * Lora input additionally has weight; create the FormView here,
 * then define a RepeatableInputView of a FormInputView
 */
class LoraFormView extends FormView {
    /**
     * @var bool disable submit button for form, automatically submit on every change
     */
    static autoSubmit = true;

    /**
     * @var object All fieldsets; the label will be removed.
     */
    static fieldSets = {
        "LoRA": {
            "model": {
                "label": "Model",
                "class": LoraInputView,
                "config": {
                    "required": true
                }
            },
            "weight": {
                "label": "Weight",
                "class": FloatInputView,
                "config": {
                    "min": 0,
                    "value": 1.0,
                    "step": 0.01,
                    "required": true
                }
            }
        }
    };
};

/**
 * The input element containing the parent form
 */
class LoraFormInputView extends FormInputView {
    /**
     * @var class The sub-form to use in the input.
     */
    static formClass = LoraFormView;
};

/**
 * Lycoris input additionally has weight; create the FormView here,
 * then define a RepeatableInputView of a FormInputView
 */
class LycorisFormView extends FormView {
    /**
     * @var bool disable submit button for form, automatically submit on every change
     */
    static autoSubmit = true;

    /**
     * @var object All fieldsets; the label will be removed.
     */
    static fieldSets = {
        "LyCORIS": {
            "model": {
                "label": "Model",
                "class": LycorisInputView,
                "config": {
                    "required": true
                }
            },
            "weight": {
                "label": "Weight",
                "class": FloatInputView,
                "config": {
                    "min": 0,
                    "value": 1.0,
                    "step": 0.01,
                    "required": true
                }
            }
        }
    };
};

/**
 * The input element containing the parent form
 */
class LycorisFormInputView extends FormInputView {
    /**
     * @var class The sub-form to use in the input.
     */
    static formClass = LycorisFormView;
};

/**
 * The overall multi-input that allows any number of lora
 */
class MultiLoraInputView extends RepeatableInputView {
    /**
     * @var class The repeatable input element.
     */
    static memberClass = LoraFormInputView;
};

/**
 * The overall multi-input that allows any number of lycoris
 */
class MultiLycorisInputView extends RepeatableInputView {
    /**
     * @var class The repeatable input element.
     */
    static memberClass = LycorisFormInputView;
};

/**
 * The overall multi-input that allows any number of inversions
 */
class MultiInversionInputView extends RepeatableInputView {
    /**
     * @var class The repeatable input element.
     */
    static memberClass = InversionInputView;
};

/**
 * Extend the SearchListInputListView to add additional classes
 */
class ModelPickerListInputView extends SearchListInputListView {
    /**
     * @var array<string> CSS classes
     */
    static classList = SearchListInputListView.classList.concat(["model-picker-list-input-view"]);
};

/**
 * Extend the StringInputView so we can strip HTML from the value
 */
class ModelPickerStringInputView extends StringInputView {
    /**
     * Strip HTML from the value and only display the name portion.
     */
    setValue(newValue, triggerChange) {
        if(!isEmpty(newValue)) {
            if (newValue.startsWith("<")) {
                newValue = createElementsFromString(newValue)[0].innerText;
            } else {
                newValue = newValue.split("/")[1];
            }
        }
        return super.setValue(newValue, triggerChange);
    }
};

/**
 * We extend the SearchListInputView to change some default config.
 */
class ModelPickerInputView extends SearchListInputView {
    /**
     * @var string The content of the node when nothing is selected.
     */
    static placeholder = "Start typing to search models…";

    /**
     * @var class The class of the string input, override so we can override setValue
     */
    static stringInputClass = ModelPickerStringInputView;

    /**
     * @var class The class of the list input, override so we can add css classes
     */
    static listInputClass = ModelPickerListInputView;
};

export {
    CheckpointInputView,
    LoraInputView,
    LycorisInputView,
    InversionInputView,
    MultiLoraInputView,
    MultiLycorisInputView,
    MultiInversionInputView,
    EngineSizeInputView,
    RefinerEngineSizeInputView,
    InpainterEngineSizeInputView,
    VAEInputView,
    SchedulerInputView,
    MultiDiffusionSchedulerInputView,
    ModelPickerStringInputView,
    ModelPickerListInputView,
    ModelPickerInputView
};
