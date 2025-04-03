import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageOps
import random

def brightness_plus_10(img): return cv2.convertScaleAbs(img, alpha=1.1, beta=0)
def brightness_plus_20(img): return cv2.convertScaleAbs(img, alpha=1.2, beta=0)
def brightness_plus_30(img): return cv2.convertScaleAbs(img, alpha=1.3, beta=0)
def brightness_plus_40(img): return cv2.convertScaleAbs(img, alpha=1.4, beta=0)
def brightness_plus_50(img): return cv2.convertScaleAbs(img, alpha=1.5, beta=0)
def brightness_minus_10(img): return cv2.convertScaleAbs(img, alpha=0.9, beta=0)
def brightness_minus_20(img): return cv2.convertScaleAbs(img, alpha=0.8, beta=0)
def brightness_minus_30(img): return cv2.convertScaleAbs(img, alpha=0.7, beta=0)
def brightness_minus_40(img): return cv2.convertScaleAbs(img, alpha=0.6, beta=0)
def brightness_minus_50(img): return cv2.convertScaleAbs(img, alpha=0.5, beta=0)

def contrast_plus_10(img): return cv2.convertScaleAbs(img, alpha=1.1, beta=0)
def contrast_plus_20(img): return cv2.convertScaleAbs(img, alpha=1.2, beta=0)
def contrast_plus_30(img): return cv2.convertScaleAbs(img, alpha=1.3, beta=0)
def contrast_minus_10(img): return cv2.convertScaleAbs(img, alpha=0.9, beta=0)
def contrast_minus_20(img): return cv2.convertScaleAbs(img, alpha=0.8, beta=0)
def contrast_minus_30(img): return cv2.convertScaleAbs(img, alpha=0.7, beta=0)

def saturation_plus_10(img): return np.array(ImageEnhance.Color(Image.fromarray(img)).enhance(1.1))
def saturation_plus_20(img): return np.array(ImageEnhance.Color(Image.fromarray(img)).enhance(1.2))
def saturation_plus_30(img): return np.array(ImageEnhance.Color(Image.fromarray(img)).enhance(1.3))
def saturation_minus_10(img): return np.array(ImageEnhance.Color(Image.fromarray(img)).enhance(0.9))
def saturation_minus_20(img): return np.array(ImageEnhance.Color(Image.fromarray(img)).enhance(0.8))

def hue_shift_plus_10(img):
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    hsv[:, :, 0] = (hsv[:, :, 0] + 10) % 180
    return cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)

def hue_shift_minus_10(img):
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    hsv[:, :, 0] = (hsv[:, :, 0] - 10) % 180
    return cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)

def hue_shift_plus_20(img):
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    hsv[:, :, 0] = (hsv[:, :, 0] + 20) % 180
    return cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
def gaussian_noise_std10(img):
    noise = np.random.normal(0, 10, img.shape).astype(np.uint8)
    return cv2.add(img, noise)

def gaussian_noise_std20(img):
    noise = np.random.normal(0, 20, img.shape).astype(np.uint8)
    return cv2.add(img, noise)

def gaussian_noise_std30(img):
    noise = np.random.normal(0, 30, img.shape).astype(np.uint8)
    return cv2.add(img, noise)

def gaussian_noise_std40(img):
    noise = np.random.normal(0, 40, img.shape).astype(np.uint8)
    return cv2.add(img, noise)

def gaussian_noise_std50(img):
    noise = np.random.normal(0, 50, img.shape).astype(np.uint8)
    return cv2.add(img, noise)

def gaussian_noise_std60(img):
    noise = np.random.normal(0, 60, img.shape).astype(np.uint8)
    return cv2.add(img, noise)

def gaussian_noise_std70(img):
    noise = np.random.normal(0, 70, img.shape).astype(np.uint8)
    return cv2.add(img, noise)

def salt_and_pepper_noise_light(img):
    output = np.copy(img)
    prob = 0.01
    rnd = np.random.rand(*img.shape[:2])
    output[rnd < prob] = 0
    output[rnd > 1 - prob] = 255
    return output

def salt_and_pepper_noise_medium(img):
    output = np.copy(img)
    prob = 0.03
    rnd = np.random.rand(*img.shape[:2])
    output[rnd < prob] = 0
    output[rnd > 1 - prob] = 255
    return output

def speckle_noise_light(img):
    noise = np.random.randn(*img.shape) * 0.1
    noisy = img + img * noise
    return np.clip(noisy, 0, 255).astype(np.uint8)

def speckle_noise_medium(img):
    noise = np.random.randn(*img.shape) * 0.2
    noisy = img + img * noise
    return np.clip(noisy, 0, 255).astype(np.uint8)

def poisson_noise(img):
    vals = len(np.unique(img))
    vals = 2 ** np.ceil(np.log2(vals))
    noisy = np.random.poisson(img * vals) / float(vals)
    return np.clip(noisy, 0, 255).astype(np.uint8)

def uniform_noise(img):
    noise = np.random.uniform(-25, 25, img.shape).astype(np.uint8)
    return cv2.add(img, noise)

def impulse_noise(img):
    output = np.copy(img)
    amount = 0.02
    num_impulse = int(amount * img.size)
    coords = [np.random.randint(0, i - 1, num_impulse) for i in img.shape[:2]]
    output[coords[0], coords[1]] = 255
    return output

def random_noise_combined(img):
    img = gaussian_noise_std20(img)
    img = salt_and_pepper_noise_light(img)
    return img
def gaussian_blur_k3(img): return cv2.GaussianBlur(img, (3, 3), 0)
def gaussian_blur_k5(img): return cv2.GaussianBlur(img, (5, 5), 0)
def gaussian_blur_k7(img): return cv2.GaussianBlur(img, (7, 7), 0)
def gaussian_blur_k9(img): return cv2.GaussianBlur(img, (9, 9), 0)
def gaussian_blur_k11(img): return cv2.GaussianBlur(img, (11, 11), 0)

def motion_blur_light(img):
    kernel = np.zeros((5, 5))
    kernel[2, :] = np.ones(5)
    kernel /= 5
    return cv2.filter2D(img, -1, kernel)

def motion_blur_medium(img):
    kernel = np.zeros((9, 9))
    kernel[4, :] = np.ones(9)
    kernel /= 9
    return cv2.filter2D(img, -1, kernel)

def median_blur_3(img): return cv2.medianBlur(img, 3)
def median_blur_5(img): return cv2.medianBlur(img, 5)

def box_blur_5(img): return cv2.blur(img, (5, 5))

def grayscale(img): return cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

def invert(img): return cv2.bitwise_not(img)

def solarize(img):
    pil_img = Image.fromarray(img)
    return np.array(ImageOps.solarize(pil_img))

def posterize(img):
    pil_img = Image.fromarray(img)
    return np.array(ImageOps.posterize(pil_img, 3))

def equalize(img):
    yuv = cv2.cvtColor(img, cv2.COLOR_BGR2YUV)
    yuv[:, :, 0] = cv2.equalizeHist(yuv[:, :, 0])
    return cv2.cvtColor(yuv, cv2.COLOR_YUV2BGR)
def clahe(img):
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)
    merged = cv2.merge((cl, a, b))
    return cv2.cvtColor(merged, cv2.COLOR_LAB2BGR)

def cartoon_effect(img): return cv2.stylization(img, sigma_s=150, sigma_r=0.25)

def pencil_sketch(img):
    _, sketch = cv2.pencilSketch(img, sigma_s=60, sigma_r=0.07, shade_factor=0.05)
    return sketch

def emboss(img):
    kernel = np.array([[-2, -1, 0],
                       [-1, 1, 1],
                       [0, 1, 2]])
    return cv2.filter2D(img, -1, kernel)

def sharpen(img):
    kernel = np.array([[0, -1, 0],
                       [-1, 5, -1],
                       [0, -1, 0]])
    return cv2.filter2D(img, -1, kernel)

def color_dropout(img):
    img = img.copy()
    img[:, :, 1:] = 0
    return img

def channel_shuffle(img):
    ch = list(cv2.split(img))  # tuple → list 변환
    random.shuffle(ch)
    return cv2.merge(ch)

def jpeg_compression_90(img):
    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]
    _, enc = cv2.imencode('.jpg', img, encode_param)
    return cv2.imdecode(enc, 1)

def jpeg_compression_70(img):
    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 70]
    _, enc = cv2.imencode('.jpg', img, encode_param)
    return cv2.imdecode(enc, 1)

def jpeg_compression_50(img):
    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 50]
    _, enc = cv2.imencode('.jpg', img, encode_param)
    return cv2.imdecode(enc, 1)

def histogram_matching(img): return img  # Placeholder
def histogram_dropout(img):
    img = img.copy()
    img[:, :, 0] = 0
    return img

def grayscale_histogram(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return cv2.merge([gray, gray, gray])

def sketch_heavy(img):
    _, sketch = cv2.pencilSketch(img, sigma_s=80, sigma_r=0.1, shade_factor=0.1)
    return sketch

def cartoon_clahe(img): return clahe(cartoon_effect(img))
def invert_color_jitter(img):
    inv = cv2.bitwise_not(img)
    return np.array(ImageEnhance.Brightness(Image.fromarray(inv)).enhance(1.3))

def contrast_sharpen(img):
    return sharpen(cv2.convertScaleAbs(img, alpha=1.3, beta=0))

def light_enhance(img):
    return cv2.add(img, np.array([30.0]))

def darkness_enhance(img):
    return cv2.subtract(img, np.array([30.0]))

def soft_blend(img):
    blur = cv2.GaussianBlur(img, (7, 7), 0)
    return cv2.addWeighted(img, 0.7, blur, 0.3, 0)

def emboss_invert(img):
    return cv2.bitwise_not(emboss(img))

def cutout_small(img):
    img = img.copy()
    img[30:50, 30:50] = 0
    return img

def cutout_medium(img):
    img = img.copy()
    img[40:80, 40:80] = 0
    return img

def cutout_large(img):
    img = img.copy()
    img[30:100, 30:100] = 0
    return img

def cutout_xlarge(img):
    img = img.copy()
    img[10:150, 10:150] = 0
    return img

def random_erasing_10px(img):
    img = img.copy()
    h, w = img.shape[:2]
    x, y = random.randint(0, w - 10), random.randint(0, h - 10)
    img[y:y+10, x:x+10] = 0
    return img

def random_erasing_20px(img):
    img = img.copy()
    h, w = img.shape[:2]
    x, y = random.randint(0, w - 20), random.randint(0, h - 20)
    img[y:y+20, x:x+20] = 0
    return img

def random_erasing_30px(img):
    img = img.copy()
    h, w = img.shape[:2]
    x, y = random.randint(0, w - 30), random.randint(0, h - 30)
    img[y:y+30, x:x+30] = 0
    return img

def dropout_brightness(img):
    img = brightness_minus_30(img)
    img[:, :, 1:] = 0
    return img

def erase_corner(img):
    img = img.copy()
    img[:50, :50] = 0
    return img

def erase_center(img):
    img = img.copy()
    h, w = img.shape[:2]
    ch, cw = h // 2, w // 2
    img[ch-25:ch+25, cw-25:cw+25] = 0
    return img
def random_shadow(img):
    img = img.copy()
    top_x, top_y = np.random.randint(0, img.shape[1]), 0
    bot_x, bot_y = np.random.randint(0, img.shape[1]), img.shape[0]
    mask = np.zeros_like(img)
    polygon = np.array([[top_x, top_y], [bot_x, bot_y],
                        [bot_x + 50, bot_y], [top_x + 50, top_y]], np.int32)
    cv2.fillPoly(mask, [polygon], (50, 50, 50))
    return cv2.addWeighted(img, 1, mask, 0.5, 0)

def random_fog(img):
    fog = np.full_like(img, 200, dtype=np.uint8)
    return cv2.addWeighted(img, 0.7, fog, 0.3, 0)

def shadow_horizontal(img):
    h, w = img.shape[:2]
    shadow = np.zeros_like(img)
    shadow[h//2:, :] = 50
    return cv2.addWeighted(img, 1, shadow, 0.5, 0)

def shadow_vertical(img):
    h, w = img.shape[:2]
    shadow = np.zeros_like(img)
    shadow[:, w//2:] = 50
    return cv2.addWeighted(img, 1, shadow, 0.5, 0)

def fog_dense(img):
    fog = np.full_like(img, 220, dtype=np.uint8)
    return cv2.addWeighted(img, 0.5, fog, 0.5, 0)

def fog_light(img):
    fog = np.full_like(img, 180, dtype=np.uint8)
    return cv2.addWeighted(img, 0.8, fog, 0.2, 0)

def vignetting(img):
    rows, cols = img.shape[:2]
    kernel_x = cv2.getGaussianKernel(cols, cols/2)
    kernel_y = cv2.getGaussianKernel(rows, rows/2)
    kernel = kernel_y * kernel_x.T
    mask = kernel / kernel.max()
    vignette = np.copy(img)
    for i in range(3):
        vignette[:, :, i] = vignette[:, :, i] * mask
    return vignette.astype(np.uint8)

def brightness_wave(img):
    wave = np.linspace(0.5, 1.5, img.shape[1])
    wave = np.tile(wave, (img.shape[0], 1))
    out = img.astype(np.float32)
    for i in range(3):
        out[:, :, i] *= wave
    return np.clip(out, 0, 255).astype(np.uint8)

def gradient_mask(img):
    h, w = img.shape[:2]
    mask = np.tile(np.linspace(0, 1, w), (h, 1))
    mask = cv2.merge([mask, mask, mask])
    return (img * mask).astype(np.uint8)

def dark_corner(img):
    rows, cols = img.shape[:2]
    X_resultant_kernel = cv2.getGaussianKernel(cols, 200)
    Y_resultant_kernel = cv2.getGaussianKernel(rows, 200)
    kernel = Y_resultant_kernel * X_resultant_kernel.T
    mask = 255 * kernel / np.linalg.norm(kernel)
    output = np.copy(img)
    for i in range(3):
        output[:, :, i] = output[:, :, i] * mask
    return output.astype(np.uint8)

# 🔁 복합 조합 필터
def blur_plus_noise(img):
    img = gaussian_blur_k5(img)
    return gaussian_noise_std30(img)

def shadow_plus_contrast(img):
    img = random_shadow(img)
    return contrast_plus_20(img)

def fog_plus_brightness_minus(img):
    img = random_fog(img)
    return brightness_minus_20(img)

def erase_plus_saturation_plus(img):
    img = random_erasing_20px(img)
    return saturation_plus_20(img)

def hue_shift_plus_dropout(img):
    img = hue_shift_plus_10(img)
    return color_dropout(img)
