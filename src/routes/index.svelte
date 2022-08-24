<script>
	import 'carbon-components-svelte/css/g80.css';
	import Cookies from 'js-cookie';
	import {
		Grid,
		Row,
		Column,
		Form,
		FormGroup,
		Button,
		PasswordInput,
		TextInput,
		ToastNotification
	} from 'carbon-components-svelte';
	import { onMount } from 'svelte';
	import { user } from '../stores/auth.js';
	const apiUrl = 'https://localhost:54612';
	var email = '';
	var password = '';
	var message = '';
	var errors = {
		email: [],
		password: []
	};

	onMount(() => {
		fetch(apiUrl + '/v1/auth/me', {
			credentials: 'include',
			headers: {
				Accept: 'application/json'
			}
		}).then((response) => {
			if (response.ok) {
				response.json().then((data) => {
					user.set(data);
				});
			}
		});
	});

	function logIn() {
		message = '';
		errors = {
			email: [],
			password: []
		};
		fetch(apiUrl + '/sanctum/csrf-cookie', {
			credentials: 'include',
			headers: {
				Accept: 'application/json'
			}
		}).then(() => {
			fetch(apiUrl + '/login', {
				credentials: 'include',
				method: 'POST',
				body: JSON.stringify({ email, password }),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN')
				}
			}).then(async (response) => {
				const json = await response.json();

				if (response.ok) {
					email = '';
				} else {
					if (json.errors) {
						errors = json.errors;
					}
					if (json.message) {
						message = json.message;
					}
				}

				password = '';
			});
		});
	}

	function logOut() {
		console.log('Logging out...');
	}
</script>

<svelte:head>
    <title>Gosumove</title>
</svelte:head>

<main>
	<Grid>
		{#if message}
			<Row>
				<Column>
					<ToastNotification
						lowContrast
						title="Error"
						subtitle={message}
						caption={new Date().toLocaleString()}
						on:close={() => {
							message = '';
						}}
					/>
				</Column>
			</Row>
		{/if}
		<Row>
			<Column>
				<Form
					on:submit={(e) => {
						e.preventDefault();
						logIn();
					}}
				>
					{#if $user}
						<Button on:click={logOut}>Log out</Button>
					{:else}
						<FormGroup>
							<TextInput
								invalid={errors.email.length ? true : false}
								invalidText={errors.email.length ? errors.email[0] : ''}
								labelText="Email"
								placeholder="Email"
								type="email"
								required
								bind:value={email}
							/>
						</FormGroup>
						<FormGroup>
							<PasswordInput
								invalid={errors.password.length ? true : false}
								invalidText={errors.password.length ? errors.password[0] : ''}
								labelText="Password"
								placeholder="Password"
								tooltipAlignment="start"
								tooltipPosition="left"
								required
								bind:value={password}
							/>
						</FormGroup>
						<Button type="submit">Log in</Button>
					{/if}
				</Form>
			</Column>
		</Row>
	</Grid>
</main>
