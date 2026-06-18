### 7.6.8 O Plugin de Ponte de Proxy do Keyring

O MySQL Keyring originalmente implementou as capacidades do keystore usando plugins do servidor, mas começou a migrar para usar a infraestrutura do componente no MySQL 8.0.24. A transição inclui a revisão da implementação subjacente dos plugins do keyring para usar a infraestrutura do componente. Isso é facilitado usando o plugin chamado `daemon_keyring_proxy_plugin`, que atua como uma ponte entre as APIs do serviço de plugin e do componente, e permite que os plugins do keyring continuem a ser usados sem alterações nas características visíveis para o usuário.

`daemon_keyring_proxy_plugin` está integrado e não é necessário fazer nada para instalá-lo ou habilitá-lo.
