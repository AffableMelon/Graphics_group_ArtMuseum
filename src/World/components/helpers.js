import { AxesHelper, GridHelper } from 'three';

function createAxesHelper() {
	const helper = new AxesHelper(3);
	helper.position.set(-3.5, 0, -3.5);
	return helper;
}

function createGridHelper() {
	const helper = new GridHelper(100);
	return helper;
}

function showLoadingOverlay(show) {
  const overlay = document.getElementById("loadingOverlay");
  if (!overlay) return;

  if (show) {
    overlay.classList.remove("fade-out");
  } else {
    overlay.classList.add("fade-out");
  }
}


export { createAxesHelper, createGridHelper, showLoadingOverlay };

