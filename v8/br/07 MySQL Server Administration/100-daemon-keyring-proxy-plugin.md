### 7.6.8 O Plugin Keyring Proxy Bridge

O MySQL Keyring originalmente implementou recursos de keystore usando plugins de servidor, mas começou a transição para usar a infraestrutura de componentes no MySQL 8.0. A transição inclui a revisão da implementação subjacente de plugins de keyring para usar a infraestrutura de componentes. Isso é facilitado usando o plugin chamado `daemon_keyring_proxy_plugin` que atua como uma ponte entre o plugin e as APIs de serviços de componentes, e permite que os plugins de keyring continuem a ser usados sem mudanças nas características visíveis ao usuário.

O `daemon_keyring_proxy_plugin` está integrado e nada precisa ser feito para instalá-lo ou ativá-lo.
