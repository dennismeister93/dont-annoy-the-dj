<script lang="ts">
	interface Props {
		href: string;
		text: string;
	}
	let { href, text }: Props = $props();
</script>

<a
	id="uri"
	{href}
	class="text-primary-300 flex items-center gap-1 hover:underline"
	target="_blank"
	rel="noopener noreferrer"
>
	{text}
</a>
