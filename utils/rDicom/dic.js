/**
 * Created by miyaye on 2020/5/10.
 */
const dicomParser = require('dicom-parser');
// const dictionary = require('@iwharris/dicom-data-dictionary');


// the DataSet object has functions to support every VR type:
// All string types - string()
// US - uint16()
// SS - int16()
// UL - uint32()
// SL - int32()
// FL - float()
// FD - double()
// DS - floatString()
// IS - intString()

class DicomObject {
    static from_array_buffer(buf) {
        //console.log(dictionary.revision);
        let dcm = new DicomObject();
        var byteArray = new Uint8Array(buf);
        try {
            // Parse the byte array to get a DataSet object that has the parsed contents
            let dataSet = dicomParser.parseDicom(byteArray/*, options */);
            dcm.dataSet = dataSet;
            //console.log(dataSet);
            return dcm;
        } catch(err) {
            console.log("Error reading DICOM: ", err);
            return undefined;
        }
    }

    get Rows() {
        return this.dataSet.uint16('x00280010');
    }

    get Columns() {
        return this.dataSet.uint16('x00280011');
    }

    get PositionPatient() {
        // The x, y, and z coordinates of the upper left hand corner (center of the first voxel transmitted)
        // of the image, in mm. See Section C.7.6.2.1.1 for further explanation.
        return [this.dataSet.floatString('x00200032', 0),
            this.dataSet.floatString('x00200032', 1),
            this.dataSet.floatString('x00200032', 2),];
    }

    get RescaleSlope() {
        return this.dataSet.floatString('x00281053');
    }

    get RescaleIntercept() {
        return this.dataSet.floatString('x00281052');
    }

    get PixelData() {
        let pixelDataElement = this.dataSet.elements.x7fe00010;
        // create a typed array on the pixel data (this example assumes 16 bit unsigned data)
        return  new Uint16Array(this.dataSet.byteArray.buffer,
            pixelDataElement.dataOffset,
            pixelDataElement.length / 2);
    }

    get WindowCenter() {
        return this.dataSet.floatString('x00281050');
    }

    get WindowWidth() {
        return this.dataSet.floatString('x00281051');
    }
    get SOPClassUID() {
        return this.dataSet.string('x00080016');
    }

    get StudyInstanceUid() {
        return this.dataSet.string('x0020000d');
    }

    get SeriesNumber() {
        return this.dataSet.string('x00200011');
    }

    get PixelSpacing() {
        return [this.dataSet.floatString('x00280030', 0),
            this.dataSet.floatString('x00280030', 1)];
    }

    get Modality() {
        return this.dataSet.string('x00080060');
    }

    get SliceThickness() {
        return this.dataSet.floatString('x00180050');
    }
}

class CTImage {
    static from_dicom_object(dcm) {
        let image = new CTImage();
        if (dcm.Modality.localeCompare('CT') != 0 && dcm.Modality.localeCompare('MR') != 0) {
            console.log('Modality shall be CT/MR');
            return undefined;
        }
        image.pixelData = dcm.PixelData;
        image.dim = [
            dcm.Columns,
            dcm.Rows
        ];
        image.spacing = [
            dcm.PixelSpacing[0],
            dcm.PixelSpacing[1],
            dcm.SliceThickness
        ];
        image.position = dcm.PositionPatient;
        image.window = dcm.WindowWidth;
        image.level = dcm.WindowCenter;
        image.intercept = dcm.RescaleIntercept;
        image.slope = dcm.RescaleSlope;
        return image;
    }
}

class CTVolume {
    constructor() {
        // this.
        this.slices = [];
    }
    add_slice(ctSlice) {
        if (!ctSlice) {
            throw("The slice is not a valid DICOM CT image.");
        }
        this.slices.push(ctSlice);
        this.slices.sort((a, b) => a.position[2] - b.position[2]);
    }

    get sliceLocations() {
        let loc = [];
        this.slices.forEach((element, index, array) => {
            loc.push(element.position[2]);
        });
        // return loc.sort((a, b) => a - b);
        return loc;
    }

    get normamlizedSliceLocations() {
        const loc = this.sliceLocations;
        const min = Math.min(...loc);
        const max = Math.max(...loc);
        const norm = loc.map(ele => (ele - min) / (max - min));
        return norm;
    }

    get pixelData() {
        const img = this.slices[0];
        const dim = img.dim;
        const len = this.slices.length;
        const num_pixels_per_image = dim[0] * dim[1];
        const size = len * 2 * num_pixels_per_image;
        const intercept = img.intercept;
        const slope = img.slope;
        let buf = new Uint16Array(size);
        this.slices.forEach((ele, idx, arr) => {
            ele.pixelData.forEach((ele1, idx1, img) => {
                buf[idx * num_pixels_per_image + idx1] = ele1 * slope + intercept + 1024;
            })
        });
        return buf;
    }

    get dim() {
        if (this.slices.length == 0) {
            return undefined;
        }
        return this.slices[0].dim;
    }

    get spacing() {
        if (this.slices.length < 2) {
            return undefined;
        }
        return [this.slices[0].spacing[0], this.slices[0].spacing[1], this.slices[1].position[2] - this.slices[0].position[2]];
    }

    get numSlices() {
        return this.slices.length;
    }
}
module.exports={DicomObject, CTImage, CTVolume};
