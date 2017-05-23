"use strict"

// Отобразить footer
function showFooterPanel() {
	$('footer.page-footer')
		.empty()
		.append(`
			<div class="footer-content">
				<table>
					<td class="footer-content-item">
						<a href="home.html?go_strictly=true" title="Перейти на главную страницу">Главная страница</a>
					</td>
					<td class="footer-content-item">
						<a href="#" title="">API</a>
					</td>
					<td class="footer-content-item">
						<a href="#" title="">Условия использования</a>
					</td>
					<td class="footer-content-item">
						<a href="#" title="">Политика конфиденциальности</a>
					</td>
				</table>
			</div>
		`);
}
